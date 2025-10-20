// SubstanceTrendChart.tsx

import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import { Stack, Typography } from "@mui/material";

// Assuming Tooltip and types are correctly imported from local files
import Tooltip from "./tooltip"; 
import {
  type LineChartProps,
  CHART_MARGIN,
  DEFAULT_MIN_HEIGHT,
  DEFAULT_MIN_WIDTH,
  type TooltipState,
  type DataPoint,
} from "./types"; 
import { drawDots } from "./utils";

// Import styles
import { chartContainerSx, titleSx, subtitleSx, svgWrapperStyle, svgBaseStyle } from './styles';


// =========================================================================
// 2. MAIN COMPONENT
// =========================================================================
export const SubstanceTrendChart = ({
  label,
  data,
  rangeMin,
  rangeMax,
  color,
}: LineChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({
    width: DEFAULT_MIN_WIDTH,
    height: DEFAULT_MIN_HEIGHT,
  });

  const [tooltipState, setTooltipState] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
    statusColor: color,
  });

  // Effect for dynamic resizing
  useEffect(() => {
    if (!containerRef.current) return;

    const measureSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: Math.max(containerRef.current.clientWidth, DEFAULT_MIN_WIDTH),
          height: Math.max(
            containerRef.current.clientHeight,
            DEFAULT_MIN_HEIGHT
          ),
        });
      }
    };

    measureSize();
    window.addEventListener("resize", measureSize);

    return () => {
      window.removeEventListener("resize", measureSize);
    };
  }, []);

  // Function to determine status color for the tooltip border
  const getStatusColor = useCallback(
    (value: number) => {
      if (value < rangeMin) return "#FF5252"; // Red (Low)
      if (value > rangeMax) return "#FFC107"; // Amber (High)
      return "#4CAF50"; // Green (Optimal)
    },
    [rangeMin, rangeMax]
  );

  // Effect for D3 rendering logic
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // --- Dimension Calculation ---
    const { width, height } = dimensions;
    const innerWidth = width - CHART_MARGIN.left - CHART_MARGIN.right;
    const innerHeight = height - CHART_MARGIN.top - CHART_MARGIN.bottom;

    if (innerWidth <= 0 || innerHeight <= 0) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${CHART_MARGIN.left},${CHART_MARGIN.top})`);

    // --- Define Scales ---
    const xScale = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.date))
      .range([0, innerWidth])
      .paddingInner(1);

    const allValues = [...data.map((d) => d.value), rangeMax, rangeMin];
    const maxVal = d3.max(allValues) || 1;
    const minVal = d3.min(allValues) || 0;
    const yDomainMin = Math.max(0, minVal - 10);

    const yScale = d3
      .scaleLinear()
      .domain([yDomainMin, maxVal])
      .range([innerHeight, 0]);

    // --- Draw Axes ---
    const axisColor = "#c2c2c2";
    const axisWidth = 0.5;

    // X Axis
    const xAxis = d3.axisBottom(xScale).tickSize(0);
    svg
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis)
      .call((g) =>
        g
          .select(".domain")
          .attr("stroke", axisColor)
          .attr("stroke-width", axisWidth)
      )
      .call((g) => g.selectAll(".tick line").remove())
      .selectAll("text")
      .attr("fill", axisColor)
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("font-family", "Manrope, sans-serif");

    // Y Axis
    const yAxis = d3.axisLeft(yScale).tickSize(0);
    svg
      .append("g")
      .call(yAxis)
      .call((g) =>
        g
          .select(".domain")
          .attr("stroke", axisColor)
          .attr("stroke-width", axisWidth)
      )
      .call((g) => g.selectAll(".tick line").remove())
      .selectAll("text")
      .attr("fill", axisColor)
      .style("font-family", "Manrope, sans-serif");

    // --- Gradient Definition for Optimal Range ---
    const defs = svg.append("defs");
    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "optimalRangeGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(60,179,113,0.0)");
    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(0,128,0,0.1)");

    // Area Animation: Fills up from the rangeMin line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "url(#optimalRangeGradient)")
      .attr("d", 
          d3.area<DataPoint>()
            .x((d) => xScale(d.date)! + xScale.bandwidth() / 2)
            .y0(yScale(rangeMin)) // Initial state: y0 and y1 are the same
            .y1(yScale(rangeMin))
            .curve(d3.curveMonotoneX)(data)
      ) 
      .transition()
      .duration(1000)
      .ease(d3.easeQuadOut)
      .attrTween("d", function(d) {
          const interpolateY1 = d3.interpolate(yScale(rangeMin), yScale(rangeMax));
          return function(t) {
            return d3.area<DataPoint>()
              .x((point) => xScale(point.date)! + xScale.bandwidth() / 2)
              .y0(() => yScale(rangeMin))
              .y1(() => interpolateY1(t))
              .curve(d3.curveMonotoneX)(d) as string;
          };
      });

    // Range Lines (No animation for simplicity)
    const rangeLineColor = "#66BB6A";

    const upperLineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.date)! + xScale.bandwidth() / 2)
      .y(() => yScale(rangeMax));

    const lowerLineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.date)! + xScale.bandwidth() / 2)
      .y(() => yScale(rangeMin));

    [upperLineGenerator, lowerLineGenerator].forEach((generator) => {
      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", rangeLineColor)
        .attr("stroke-dasharray", "5 5")
        .attr("stroke-width", 1.5)
        .attr("d", generator);
    });

    // Main Value Line
    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.date)! + xScale.bandwidth() / 2)
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // --- LINE DRAWING ANIMATION ---
    const path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2) 
      .attr("d", lineGenerator);

    const totalLength = path.node()?.getTotalLength() || 0;

    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength) // Start hidden
      .transition()
      .duration(1500) // Line draws over 1.5 seconds
      .ease(d3.easeSin) 
      .attr("stroke-dashoffset", 0) // Animate to fully drawn
      
      // Call the dot creation function AFTER the line animation completes
      .on("end", () => {
          drawDots(svg as unknown as d3.Selection<SVGGElement, undefined, HTMLElement, unknown>, data, xScale, yScale, color, getStatusColor, setTooltipState, label, rangeMin, rangeMax, CHART_MARGIN);
      });
    // --- END ANIMATION LOGIC ---

  }, [data, rangeMax, rangeMin, dimensions.width, dimensions.height, color, label, dimensions, getStatusColor]);

  return (
    <Stack
      sx={chartContainerSx} // Use imported style
    >
      <Typography sx={titleSx}>
        {label} History
      </Typography>
      <Typography
        sx={subtitleSx}
      >
        This section visualizes your **{label}** levels over time, highlighting
        history against time progression.
      </Typography>

      <div
        ref={containerRef}
        style={svgWrapperStyle}
      >
        <svg ref={svgRef} style={svgBaseStyle}></svg>
      </div>

      <Tooltip {...tooltipState} />
    </Stack>
  );
};