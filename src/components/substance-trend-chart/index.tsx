import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Stack, Typography } from '@mui/material';

// Mocking @mui/material components for a self-contained, runnable file

// --- Component Interfaces and Types ---
interface DataPoint {
  date: string;
  value: number;
}

export type LineChartProps = {
  label: string
  data: DataPoint[];
  rangeMin: number;
  rangeMax: number;
  color: string
}

// Increased bottom margin from 40 to 80 to prevent rotated X-axis labels from cutting off.
const CHART_MARGIN = { top: 20, right: 30, bottom: 80, left: 50 };
const DEFAULT_MIN_HEIGHT = 200;
const DEFAULT_MIN_WIDTH = 300;

const LineChart = ({
  label,
  data,
  rangeMin,
  rangeMax,
  color
}: LineChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); 
  
  // State to hold dynamic pixel dimensions
  const [dimensions, setDimensions] = useState({ 
    width: DEFAULT_MIN_WIDTH, 
    height: DEFAULT_MIN_HEIGHT 
  });
  
  // Effect for dynamic resizing and measurement
  useEffect(() => {
    if (!containerRef.current) return;

    const measureSize = () => {
      if (containerRef.current) {
        // Measure client dimensions, ensuring we use at least the minimums
        setDimensions({
          width: Math.max(containerRef.current.clientWidth, DEFAULT_MIN_WIDTH),
          height: Math.max(containerRef.current.clientHeight, DEFAULT_MIN_HEIGHT),
        });
      }
    };

    // Initial measurement
    measureSize();

    // Setup for basic responsiveness on window resize
    window.addEventListener('resize', measureSize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', measureSize);
    };
  }, []); 

  // Effect for D3 rendering logic
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;
    
    // ----------------------------------------------------------------
    // --- DIMENSION CALCULATION ---
    // ----------------------------------------------------------------
    const { width, height } = dimensions;
    const innerWidth = width - CHART_MARGIN.left - CHART_MARGIN.right;
    const innerHeight = height - CHART_MARGIN.top - CHART_MARGIN.bottom;

    // Safety check for zero dimensions (crucial for modal rendering)
    if (innerWidth <= 0 || innerHeight <= 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${CHART_MARGIN.left},${CHART_MARGIN.top})`);

    // --- Define Scales ---
    const xScale = d3
      .scaleBand<string>()
      .domain(data.map(d => d.date))
      .range([0, innerWidth])
      .paddingInner(1);

    const allValues = [
      ...data.map(d => d.value),
      rangeMax,
      rangeMin,
    ];
    const maxVal = d3.max(allValues) || 1;
    const minVal = d3.min(allValues) || 0;

    // --- NEW Y-AXIS DOMAIN LOGIC ---
    // Start the domain 10 units below the minimum value (minVal), 
    // but ensure it never goes below 0.
    const yDomainMin = Math.max(0, minVal - 10); 
    
    const yScale = d3
      .scaleLinear()
      .domain([yDomainMin, maxVal])
      .range([innerHeight, 0]);

    // ----------------------------------------------------------------
    // --- Draw Axes (Styled) ---
    // ----------------------------------------------------------------

    const axisColor = '#c2c2c2'; 
    const axisWidth = 0.5;       

    // X Axis
    const xAxis = d3.axisBottom(xScale).tickSize(0); 
    svg
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .call(g => g.select('.domain')
        .attr('stroke', axisColor)
        .attr('stroke-width', axisWidth)) 
      .call(g => g.selectAll('.tick line').remove())
      .selectAll('text')
      .attr('fill', axisColor)
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Y Axis
    const yAxis = d3.axisLeft(yScale).tickSize(0); 
    svg
      .append('g')
      .call(yAxis)
      .call(g => g.select('.domain')
        .attr('stroke', axisColor)
        .attr('stroke-width', axisWidth))
      .call(g => g.selectAll('.tick line').remove())
      .selectAll('text')
      .attr('fill', axisColor); 


    // ----------------------------------------------------------------
    // --- Gradient Definition ---
    // ----------------------------------------------------------------
    const defs = svg.append('defs');

    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'optimalRangeGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    const gradientTopColor = 'rgba(60,179,113,0.0)';
    const gradientBottomColor = 'rgba(0,128,0,0.1)';

    linearGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', gradientTopColor);

    linearGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', gradientBottomColor);

    // ----------------------------------------------------------------
    // --- Chart Elements ---
    // ----------------------------------------------------------------
    
    // Area
    const constantAreaGenerator = d3
      .area<DataPoint>()
      .x(d => xScale(d.date)! + xScale.bandwidth() / 2)
      .y0(yScale(rangeMin))
      .y1(yScale(rangeMax))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'url(#optimalRangeGradient)')
      .attr('d', constantAreaGenerator);
    
    // Range Lines
    const rangeLineColor = '#66BB6A';

    const upperLineGenerator = d3
      .line<DataPoint>()
      .x(d => xScale(d.date)! + xScale.bandwidth() / 2)
      .y(() => yScale(rangeMax));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', rangeLineColor)
      .attr('stroke-dasharray', '5 5')
      .attr('stroke-width', 1.5)
      .attr('d', upperLineGenerator);

    const lowerLineGenerator = d3
      .line<DataPoint>()
      .x(d => xScale(d.date)! + xScale.bandwidth() / 2)
      .y(() => yScale(rangeMin));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', rangeLineColor)
      .attr('stroke-dasharray', '5 5')
      .attr('stroke-width', 1.5)
      .attr('d', lowerLineGenerator);

    // Main Value Line
    const lineGenerator = d3
      .line<DataPoint>()
      .x(d => xScale(d.date)! + xScale.bandwidth() / 2)
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color) 
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    // Circles
    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.date)! + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.value))
      .attr('r', 4)
      .attr('fill', color); 

  }, [data, rangeMax, rangeMin, dimensions.width, dimensions.height, color, dimensions]);


  return (
    <Stack
      // The outer Stack defines the overall container size
      sx={{
        gap: 1,
        flex: 1,
        maxWidth: "100%",
        borderRadius: "16px",
        px: 2,
        py: 2, 
        height: '100%', // Important for filling the modal height
        minHeight: '400px', // Ensure a minimum visible size
      }}
    >
      <Typography sx={{ fontWeight: 500, fontSize: 18 }}>
        {label} History
      </Typography>
      <Typography
        sx={{ fontWeight: 400, fontSize: 14, color: "text.secondary", mb: 1 }}
      >
        This section visualizes your {label} levels over time, highlighting history against time progression.
      </Typography>
      
      {/* This div acts as the measurable container for the SVG. 
        FlexGrow ensures it takes up all remaining vertical space.
      */}
      <div 
        ref={containerRef} 
        style={{ width: '100%', flexGrow: 1 }} 
      >
        {/* The SVG element itself */}
        <svg ref={svgRef} style={{ display: 'block' }}></svg>
      </div>
    </Stack>
  );
};

export default LineChart;
