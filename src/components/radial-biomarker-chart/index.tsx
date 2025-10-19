import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react'; // ADDED useCallback
import * as d3 from 'd3';
import { Stack, Typography } from '@mui/material';

// Define the new data structure
export type DataPoint = {
  rangeValue: number; // Normalized radial value (0-100)
  value: number; // Actual value
  category: string; // The substance name (e.g., 'creatine')
  date: string; // The test date
  color: string; // Color associated with the substance
  label: string; // Label for the substance
}

interface RadialChartProps {
  data: DataPoint[];
  innerRadius?: number;
  outerRadius?: number;
  showCentralText?: boolean;
  centralNumber?: number;
  centralLabel?: string;
}

// --- Tooltip Component State and Definition ---
interface TooltipState {
    visible: boolean;
    x: number;
    y: number;
    data: null | DataPoint;
    statusColor: string
}

const Tooltip: React.FC<TooltipState> = ({ visible, x, y, data: _data, statusColor }) => {
  if (!visible) return null;
    return (
        <Stack
            style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: "row",
                left: x,
                top: y,
                pointerEvents: 'none', 
                background: '#fff', 
                color: 'black',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.9em',
                fontFamily: 'Manrope, sans-serif',
                maxWidth: '200px',
                transform: 'translate(-50%, calc(-100% - 10px))', 
                boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                zIndex: 1000,
                gap: 8,
            }}
        >
          <Stack sx={{ width: 3, background : statusColor, borderRadius: 1 }} />
          <Stack>
            <Typography sx={{ color: _data?.color, fontWeight: 600 }}>{_data?.label}</Typography>
            <Typography sx={{ color: '#C4C4C4', fontWeight: 500, fontSize: 12 }}>{_data?.date}</Typography>
            <Typography sx={{ fontWeight: 600, fontSize: 20 }}>{_data?.value}</Typography>
          </Stack>
        </Stack>
    );
};

// --- Radial Chart Component ---
const RadialChart: React.FC<RadialChartProps> = ({
  data,
  innerRadius = 80,
  outerRadius = 160,
  showCentralText = true,
  centralNumber = 6,
  centralLabel = 'Optimal Biomarkers',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState<TooltipState>({
      visible: false,
      x: 0,
      y: 0,
      data: null,
      statusColor: ''
  });

  // --- Utility Functions ---
  const formatSubstanceName = (name: string) => {
    return name.split('_')
               .map(word => word.charAt(0).toUpperCase() + word.slice(1))
               .join(' ');
  };
  
  // --- Tooltip Event Handlers (useCallback to prevent unnecessary re-creation) ---
  const showTooltip = useCallback((event: MouseEvent, data: DataPoint) => {
      const categoryName = data.label;
      const date = new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

      const containerRect = containerRef.current!.getBoundingClientRect();
      
      setTooltip({
          visible: true,
          x: event.clientX - containerRect.left,
          y: event.clientY - containerRect.top,
          data: {...data, date: date, label: categoryName },
          statusColor: data.rangeValue < 33 ? '#E53935' : (data.rangeValue > 66 ? '#FFB300' : '#11A546'),
      });
  }, [setTooltip]); // Dependency on setTooltip (which is stable)

  const hideTooltip = useCallback(() => {
      setTooltip(prev => (prev.visible ? { ...prev, visible: false } : prev));
  }, [setTooltip]); // Dependency on setTooltip (which is stable)

  // --- Memoized Data/Config ---
  const markerColorRange = useMemo(() => data.map(_data => _data.color), [data]);

  const legendData = useMemo(() => {
    const legendMap: { [key: string]: {
      color: string;
      label: string
    } } = {};
    data.forEach(d => legendMap[d.category] = { color: d.color, label: d.label });
    return Object.entries(legendMap).map(([category, {color, label}]) => ({ category, label, color }));
  },[data]);

  const allCategories = useMemo(() => Array.from(new Set(data.map(d => d.category))).sort(), [data]);
  const numCategories = allCategories.length;

  const categoryAngles = useMemo(() => { 
    const angles: { [key: string]: [number, number] } = {};
    const angularSize = (2 * Math.PI) / numCategories;

    let currentAngle = 0;
    allCategories.forEach((category) => {
      angles[category] = [currentAngle, currentAngle + angularSize];
      currentAngle += angularSize;
    });

    return angles;
  }, [allCategories, numCategories]);


  // --- Dynamic Size Calculation ---
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const svgContainer = containerRef.current.querySelector('svg')?.parentElement;
        if (svgContainer) {
            const { width, height } = svgContainer.getBoundingClientRect();
            setDimensions({ width: width || 400, height: height || 400 }); 
        }
      }
    };

    const timeout = setTimeout(measure, 50); 
    window.addEventListener('resize', measure);

    return () => {
        clearTimeout(timeout);
        window.removeEventListener('resize', measure);
    };
  }, []);

  const { width, height } = dimensions; 
  
  // Calculate scaled dimensions (only depends on static props/dynamic dimensions)
  const [currentInnerRadius, currentOuterRadius, SCALE_FACTOR] = useMemo(() => {
    const maxDimension = Math.min(width, height);
    const chartRadius = (maxDimension / 2) * 0.9; 
    
    const REFERENCE_OUTER_RADIUS = 200;
    const currentOuterR = chartRadius * (outerRadius / REFERENCE_OUTER_RADIUS); 
    const currentInnerR = currentOuterR * (innerRadius / outerRadius);
    const scaleFactor = currentOuterR / REFERENCE_OUTER_RADIUS;
    
    return [currentInnerR, currentOuterR, scaleFactor];
  }, [width, height, innerRadius, outerRadius]);


  // --- D3 Drawing Logic (Dependencies now stable) ---
  useEffect(() => {
    // Note: showTooltip and hideTooltip are NOT in the dependency array here.
    // We rely on them being stable (via useCallback) when used in the D3 listeners.
    if (!svgRef.current || data.length === 0 || width === 0 || height === 0) return; 

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const centerX = width / 2;
    const centerY = height / 2;
    
    const g = svg.append('g').attr('transform', `translate(${centerX},${centerY})`);

    const radiusScale = d3.scaleLinear()
      .domain([0, 100])
      .range([currentInnerRadius, currentOuterRadius]);

    // 1. Draw the concentric circles (grid lines)
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
      
    // White background for the empty center 
    g.append('circle')
      .attr('class', 'center-fill')
      .attr('r', currentInnerRadius - 1)
      .attr('fill', 'white')
      .attr('opacity', 0)
      .transition()
      .duration(800)
      .delay(100)
      .attr('opacity', 1);

    // 2. Draw the radial lines (spoke lines)
    allCategories.forEach((category, i) => {
        const angle = categoryAngles[category][0]; 
        
        g.append('line')
          .attr('class', 'grid-line')
          .attr('x1', 0) 
          .attr('y1', 0)
          .attr('x2', 0)
          .attr('y2', 0)
          .attr('stroke', '#ccc')
          .attr('stroke-width', 0.5)
          .transition()
          .duration(1000)
          .delay(i * 100 + 300)
          .attr('x1', Math.cos(angle) * currentInnerRadius) 
          .attr('y1', Math.sin(angle) * currentInnerRadius)
          .attr('x2', Math.cos(angle) * currentOuterRadius)
          .attr('y2', Math.sin(angle) * currentOuterRadius);
    });
    // Final spoke line
    const lastCategory = allCategories[allCategories.length - 1];
    const lastAngle = categoryAngles[lastCategory][1];
    g.append('line')
        .attr('class', 'grid-line')
        .attr('x1', 0) 
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 0.5)
        .transition()
        .duration(1000)
        .delay(numCategories * 100 + 300)
        .attr('x1', Math.cos(lastAngle) * currentInnerRadius) 
        .attr('y1', Math.sin(lastAngle) * currentInnerRadius)
        .attr('x2', Math.cos(lastAngle) * currentOuterRadius)
        .attr('y2', Math.sin(lastAngle) * currentOuterRadius);


    // 3. Draw the background segments
    const arcGenerator = d3.arc<unknown>()
      .innerRadius(currentInnerRadius)
      .outerRadius(currentOuterRadius);

    allCategories.forEach((category, i) => {
      const angles = categoryAngles[category];
      g.append('path')
        .attr('d', arcGenerator({
          startAngle: angles[0],
          endAngle: angles[1]
        }))
        .attr('fill',  '#fff') 
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .delay(1000 + i * 50)
        .attr('opacity', 0.1);
    });

    // 4. Draw the data points
    const JITTER_OFFSET_PIXELS = 10 * SCALE_FACTOR; 
    const MARKER_RADIUS = 5 * SCALE_FACTOR; 
    const HIGHLIGHT_FILL_RADIUS = MARKER_RADIUS * 1.6;
    const HIGHLIGHT_BORDER_RADIUS = HIGHLIGHT_FILL_RADIUS + (2 * SCALE_FACTOR);
    const LATEST_BORDER_COLOR = '#333333';
    const LATEST_BORDER_WIDTH = 1 * SCALE_FACTOR; 
    
    const chartGroup = g;

    allCategories.forEach(category => {
        const categoryData = data.filter(d => d.category === category);
        
        const latestSubstanceDate = d3.max(categoryData, d => new Date(d.date))?.toISOString().split('T')[0];

        const [startAngle, endAngle] = categoryAngles[category];
        
        const pointAngleScale = d3.scaleLinear()
            .domain([0, categoryData.length])
            .range([startAngle + 0.05, endAngle - 0.05]); 

        g.selectAll(`.data-point-${category}`)
          .data(categoryData)
          .enter()
          .each(function(d, i) {
            const isLatest = d.date === latestSubstanceDate;
            const markerColor = d.color;

            const angle = pointAngleScale(i + 0.5); 
            const radialPosition = radiusScale(d.rangeValue); 
            const offset = i % 2 === 0 ? JITTER_OFFSET_PIXELS : -JITTER_OFFSET_PIXELS;
            const cx = Math.cos(angle) * radialPosition + (-Math.sin(angle) * offset);
            const cy = Math.sin(angle) * radialPosition + (Math.cos(angle) * offset);

            if (isLatest) {
              // 1. Inner filled circle
              chartGroup 
                .append('circle')
                .attr('class', `data-point-latest-fill-${category}`)
                .attr('r', 0) 
                .attr('fill', markerColor)
                .attr('cx', cx)
                .attr('cy', cy)
                // Use stable event handlers
                .on('mouseover', (event) => showTooltip(event as MouseEvent, d))
                .on('mousemove', (event) => showTooltip(event as MouseEvent, d))
                .on('mouseout', hideTooltip)
                .transition()
                .duration(500)
                .delay(1600 + i * 50) 
                .ease(d3.easeElasticOut)
                .attr('r', HIGHLIGHT_FILL_RADIUS - (1.5 * SCALE_FACTOR));

              // 2. Outer border circle 
              chartGroup
                .append('circle')
                .attr('class', `data-point-latest-border-${category}`)
                .attr('r', 0) 
                .attr('fill', 'none') 
                .attr('stroke', LATEST_BORDER_COLOR)
                .attr('stroke-width', LATEST_BORDER_WIDTH)
                .attr('cx', cx)
                .attr('cy', cy)
                // Use stable event handlers
                .on('mouseover', (event) => showTooltip(event as MouseEvent, d))
                .on('mousemove', (event) => showTooltip(event as MouseEvent, d))
                .on('mouseout', hideTooltip)
                .transition()
                .duration(500)
                .delay(1600 + i * 50) 
                .ease(d3.easeElasticOut)
                .attr('r', HIGHLIGHT_BORDER_RADIUS);

            } else {
              // --- ONE CIRCLE for Historical Markers ---
              chartGroup
                .append('circle')
                .attr('class', `data-point-${category}`)
                .attr('r', 0) 
                .attr('fill', markerColor)
                .attr('stroke', '#FFFFFF')
                .attr('stroke-width', 1.5 * SCALE_FACTOR)
                .attr('cx', cx)
                .attr('cy', cy)
                // Use stable event handlers
                .on('mouseover', (event) => showTooltip(event as MouseEvent, d))
                .on('mousemove', (event) => showTooltip(event as MouseEvent, d))
                .on('mouseout', hideTooltip)
                .transition()
                .duration(500)
                .delay(1600 + i * 50) 
                .ease(d3.easeElasticOut)
                .attr('r', MARKER_RADIUS);
            }
          });
    });

    // 5. Add central text (Fade in)
    const centralTextScale = SCALE_FACTOR * 0.5; 
    if (showCentralText) {
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('y', -20 * SCALE_FACTOR) 
        .attr('font-size', `${6 * centralTextScale}em`) 
        .attr('font-weight', 'bold')
        .attr('fill', '#333')
        .attr('opacity', 0)
        .style('font-family', 'Manrope, sans-serif')
        .text(centralNumber)
        .transition()
        .duration(800)
        .delay(2000)
        .attr('opacity', 1);

      centralLabel.split(" ").forEach((word, index) => {
        g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('y', 20 * SCALE_FACTOR+ (index* 20)) 
        .attr('font-size', `${1.4 * SCALE_FACTOR}em`)
        .attr('fill', '#555')
        .attr('opacity', 0)
        .style('font-family', 'Manrope, sans-serif')
        .text(word)
        .transition()
        .duration(800)
        .delay(2100)
        .attr('opacity', 1);
      });


    }
    
    // 6. Add outer labels (Fade in)
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

      g.append('text')
        .attr('x', x) 
        .attr('y', y) 
        .attr('transform', `rotate(${rotation}, ${x}, ${y})`) 
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', `${labelFontSize}em`) 
        .attr('fill', '#555')
        .attr('opacity', 0)
        .style('font-family', 'Manrope, sans-serif')
        .text(data.find(d => d.category === category)?.label || formatSubstanceName(category))
        .transition()
        .duration(800)
        .delay(1800 + i * 50)
        .attr('opacity', 1);
    });

  }, [data, allCategories, categoryAngles, dimensions, currentInnerRadius, currentOuterRadius, SCALE_FACTOR, markerColorRange, showCentralText, centralNumber, centralLabel, width, height, numCategories, hideTooltip, showTooltip]); // The dependencies are now minimal and stable.

  return (
    <Stack ref={containerRef} width="100%" height="100%" gap={1} sx={{ position: 'relative' }}>
      <Typography sx={{ fontWeight: 500, fontSize: 18 }}>
          Your Personalized Biomarker Trends
        </Typography>
        <Typography sx={{  fontWeight: 400, fontSize: 14, color: 'text.secondary', mb: 1 }}>
            Review the complete picture of your health metrics. Each point in the graph represents a key biomarker and you can easily compare your Last Recorded Value (specially bordered marker) with your other results to see the shift in your measurements.
        </Typography>
      <Stack>
        <svg ref={svgRef} width={width} height={height}></svg>
      </Stack>
      
      <Tooltip 
          visible={tooltip.visible} 
          x={tooltip.x} 
          y={tooltip.y} 
          data={tooltip.data} 
          statusColor={tooltip.statusColor}
      />

      {/* Legend */}
      <Stack direction="row" flexWrap="wrap" gap={2} sx={{ 
        paddingLeft: 2, 
        paddingRight: 2, 
        justifyContent: 'center' 
      }}>
        <Stack flexDirection="row" alignItems="center" gap={1}>
          <Stack sx={{
            borderRadius: 14,
            width: 11,
            height: 11,
            borderColor: "#333333",
            borderWidth: 2 * SCALE_FACTOR,
            borderStyle: "solid",
            background: "transparent", 
          }} />
          <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#333333" }}>
            Last Recorded Value
          </Typography>
        </Stack>
        {legendData.map((_data) => 
          <Stack key={`legen-item-radial-biomarker-chart-${_data.label}`} flexDirection="row" alignItems="center" gap={1}>
            <Stack sx={{
              borderRadius: 14,
              width: 12,
              height: 12,
              background: _data.color,
            }} />
            <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#333333" }}>
              {_data.label}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default RadialChart;