
import * as d3 from 'd3';
import type { DataPoint, CategoryAngles, ChartHandlers } from "./types";

// Define the core D3 rendering logic outside the component (or use useCallback/useMemo) 
// to avoid deep nesting and simplify the main useEffect.
export const drawChart = (
    svgElement: SVGSVGElement,
    data: DataPoint[],
    dimensions: { width: number, height: number },
    currentInnerRadius: number,
    currentOuterRadius: number,
    SCALE_FACTOR: number,
    allCategories: string[],
    categoryAngles: CategoryAngles,
    showCentralText: boolean,
    centralNumber: number,
    centralLabel: string,
    handlers: ChartHandlers
) => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0 || data.length === 0) return;

    const { showTooltip, hideTooltip } = handlers;
    
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    const centerX = width / 2;
    const centerY = height / 2;

    const g = svg.append('g').attr('transform', `translate(${centerX},${centerY})`);

    const radiusScale = d3.scaleLinear()
        .domain([0, 100])
        .range([currentInnerRadius, currentOuterRadius]);

    // --- 1. Draw the concentric circles (grid lines) ---
    const numRings = 4;
    const ringStep = (currentOuterRadius - currentInnerRadius) / numRings;

    g.selectAll('.grid-circle')
        .data(d3.range(numRings + 1))
        .enter()
        .append('circle')
        .attr('class', 'grid-circle')
        .attr('r', 0)
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-dasharray', '2,2')
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .delay((_d, i) => i * 100)
        .attr('r', (d) => currentInnerRadius + d * ringStep)
        .attr('opacity', 1);

    // White center background
    g.append('circle')
        .attr('class', 'center-fill')
        .attr('r', currentInnerRadius - 1)
        .attr('fill', 'white')
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .delay(100)
        .attr('opacity', 1);

    // --- 2. Draw the radial lines (spokes) ---
    const drawSpokes = (angle: number, i: number, delayOffset: number) => {
        g.append('line')
            .attr('class', 'grid-line')
            .attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 0)
            .attr('stroke', '#ccc')
            .attr('stroke-width', 0.5)
            .transition()
            .duration(1000)
            .delay(i * 100 + delayOffset)
            .attr('x1', Math.cos(angle) * currentInnerRadius)
            .attr('y1', Math.sin(angle) * currentInnerRadius)
            .attr('x2', Math.cos(angle) * currentOuterRadius)
            .attr('y2', Math.sin(angle) * currentOuterRadius);
    };

    allCategories.forEach((category, i) => {
        drawSpokes(categoryAngles[category][0], i, 300);
    });

    const lastCategory = allCategories[allCategories.length - 1];
    if (lastCategory) {
        drawSpokes(categoryAngles[lastCategory][1], allCategories.length, 300);
    }
    
    // --- 3. Draw the background range rings (Low/High) ---
    const rangeColors = [
        { from: currentInnerRadius, to: currentInnerRadius + (currentOuterRadius - currentInnerRadius) * 0.24, color: '#E53935', opacity: 0.1 }, // Low
        { from: currentInnerRadius + (currentOuterRadius - currentInnerRadius) * 0.76, to: currentOuterRadius, color: '#FFB300', opacity: 0.1 }, // High
    ];
    // Add a subtle middle ring for context
    const normalRangeStart = currentInnerRadius + (currentOuterRadius - currentInnerRadius) * 0.33;
    const normalRangeEnd = currentInnerRadius + (currentOuterRadius - currentInnerRadius) * 0.66;

    rangeColors.push({
      from: normalRangeStart,
      to: normalRangeEnd,
      color: '#4CAF50', // Normal (Green)
      opacity: 0.05,
    });


    rangeColors.forEach((range, i) => {
        const arc = d3.arc()
            .innerRadius(range.from)
            .outerRadius(range.to)
            .startAngle(0)
            .endAngle(2 * Math.PI);

        g.append('path')
            .attr('d', arc as unknown as string)
            .attr('fill', range.color)
            .attr('opacity', 0)
            .transition()
            .duration(800)
            .delay(600 + i * 200)
            .attr('opacity', range.opacity);
    });

    // --- 4. Draw the data points ---
    const JITTER_OFFSET_PIXELS = 10 * SCALE_FACTOR;
    const MARKER_RADIUS = 5 * SCALE_FACTOR;
    const HIGHLIGHT_FILL_RADIUS = MARKER_RADIUS * 1.6;
    const HIGHLIGHT_BORDER_RADIUS = HIGHLIGHT_FILL_RADIUS + (2 * SCALE_FACTOR);
    const LATEST_BORDER_COLOR = '#333333';
    const LATEST_BORDER_WIDTH = 1 * SCALE_FACTOR;

    allCategories.forEach(category => {
        const categoryData = data.filter(d => d.category === category);
        
        // Find the date of the latest point for this category
        const latestSubstanceDate = d3.max(categoryData, d => new Date(d.date))?.toISOString().split('T')[0];

        const [startAngle, endAngle] = categoryAngles[category];
        
        // Create an angular band scale within the category segment
        const pointAngleScale = d3.scaleBand()
            .domain(categoryData.map(d => d.date))
            .range([startAngle + 0.05, endAngle - 0.05])
            .paddingInner(1); 

        g.selectAll(`.data-point-${category}`)
          .data(categoryData)
          .enter()
          .each(function(d) {
            const isLatest = d.date === latestSubstanceDate;
            const markerColor = d.color;
            const angle = pointAngleScale(d.date)! + pointAngleScale.bandwidth() / 2;
            const radialPosition = radiusScale(d.rangeValue); 
            
            // Apply jitter based on value for visual separation
            const offset = (d.value % 2 === 0 ? JITTER_OFFSET_PIXELS : -JITTER_OFFSET_PIXELS) * Math.random() * 0.5;

            const cx = Math.cos(angle) * radialPosition + (-Math.sin(angle) * offset);
            const cy = Math.sin(angle) * radialPosition + (Math.cos(angle) * offset);
            
            // Helper function to attach event listeners
            const attachEvents = (selection: d3.Selection<never, DataPoint, never, never>) => {
              selection
                .style('cursor', 'pointer')
                .on('mouseover', (event) => showTooltip(event, d))
                .on('mousemove', (event) => showTooltip(event, d))
                .on('mouseout', hideTooltip);
            }

            if (isLatest) {
              // Latest marker (Bordered Highlight)
              const borderCircle = g.append('circle')
                .attr('class', `data-point-latest-border-${category}`)
                .attr('r', 0).attr('fill', 'none').attr('stroke', LATEST_BORDER_COLOR)
                .attr('stroke-width', LATEST_BORDER_WIDTH).attr('cx', cx).attr('cy', cy);
              
              const fillCircle = g.append('circle')
                .attr('class', `data-point-latest-fill-${category}`)
                .attr('r', 0).attr('fill', markerColor).attr('cx', cx).attr('cy', cy);

              attachEvents(borderCircle as never);
              attachEvents(fillCircle as never);

              borderCircle.transition().duration(500).delay(1600).ease(d3.easeElasticOut).attr('r', HIGHLIGHT_BORDER_RADIUS);
              fillCircle.transition().duration(500).delay(1600).ease(d3.easeElasticOut).attr('r', HIGHLIGHT_FILL_RADIUS - (1.5 * SCALE_FACTOR));

            } else {
              // Historical markers
              const historyCircle = g.append('circle')
                .attr('class', `data-point-${category}`)
                .attr('r', 0).attr('fill', markerColor).attr('stroke', '#FFFFFF')
                .attr('stroke-width', 1.5 * SCALE_FACTOR).attr('cx', cx).attr('cy', cy);
              
              attachEvents(historyCircle as never);
              historyCircle.transition().duration(500).delay(1600).ease(d3.easeElasticOut).attr('r', MARKER_RADIUS);
            }
          });
    });

    // --- 5. Add central text ---
    const centralTextScale = SCALE_FACTOR * 0.5; 
    if (showCentralText) {
      g.append('text')
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('y', -20 * SCALE_FACTOR) 
        .attr('font-size', `${6 * centralTextScale}em`).attr('font-weight', 'bold')
        .attr('fill', '#333').attr('opacity', 0)
        .style('font-family', 'Manrope, sans-serif').text(centralNumber)
        .transition().duration(800).delay(2000).attr('opacity', 1);

      centralLabel.split(" ").forEach((word, index) => {
        g.append('text')
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('y', 20 * SCALE_FACTOR + (index * 20)) 
        .attr('font-size', `${1.4 * SCALE_FACTOR}em`).attr('fill', '#555').attr('opacity', 0)
        .style('font-family', 'Manrope, sans-serif').text(word)
        .transition().duration(800).delay(2100).attr('opacity', 1);
      });
    }
    
    // --- 6. Add outer labels ---
    const mainLabelRadius = currentOuterRadius + (25 * SCALE_FACTOR); 
    const labelFontSize = 0.9 * SCALE_FACTOR;

    allCategories.forEach((category, i) => {
      const angles = categoryAngles[category];
      const midAngle = (angles[0] + angles[1]) / 2; 

      const x = Math.cos(midAngle) * mainLabelRadius;
      const y = Math.sin(midAngle) * mainLabelRadius;

      let rotation = (midAngle * 180 / Math.PI) + 90; 
      if (midAngle > Math.PI / 2 && midAngle < 1.5 * Math.PI) {
          rotation += 180; 
      }
      
      const labelText = data.find(d => d.category === category)?.label || category;

      g.append('text')
        .attr('x', x).attr('y', y) 
        .attr('transform', `rotate(${rotation}, ${x}, ${y})`) 
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('font-size', `${labelFontSize}em`).attr('fill', '#555').attr('opacity', 0)
        .style('font-family', 'Manrope, sans-serif').text(labelText)
        .transition().duration(800).delay(1800 + i * 50).attr('opacity', 1);
    });
};