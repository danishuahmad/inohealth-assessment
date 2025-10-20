import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Stack, Typography } from "@mui/material"; // Added Box for Tooltip styling

// --- Chart Interface Definitions ---
interface DataPoint {
  date: string;
  value: number;
}

export type LineChartProps = {
  label: string;
  data: DataPoint[];
  rangeMin: number;
  rangeMax: number;
  color: string;
};

// --- Constants ---
const CHART_MARGIN = { top: 20, right: 30, bottom: 80, left: 50 };
const DEFAULT_MIN_HEIGHT = 200;
const DEFAULT_MIN_WIDTH = 300;

// --- Tooltip Component State and Definition ---
interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  // Modified to use DataPoint and include chart props for context
  data:
    | null
    | (DataPoint & {
        label: string;
        color: string;
        rangeMin: number;
        rangeMax: number;
      });
  statusColor: string;
}

const Tooltip: React.FC<TooltipState> = ({
  visible,
  x,
  y,
  data: _data,
  statusColor,
}) => {
  if (!visible || !_data) return null;

  return (
    <Stack
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        left: x,
        top: y,
        pointerEvents: "none",
        background: "#fff",
        color: "black",
        padding: "8px 12px",
        borderRadius: "6px",
        fontSize: "0.9em",
        fontFamily: "Manrope, sans-serif",
        maxWidth: "200px",
        transform: "translate(-50%, calc(-1% - 10px))",
        boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
        zIndex: 1000,
        gap: 8,
      }}
    >
      <Stack sx={{ width: 3, background: statusColor, borderRadius: 1 }} />
      <Stack>
        <Typography sx={{ color: _data?.color, fontWeight: 600 }}>
          {_data?.label}
        </Typography>
        <Typography sx={{ color: "#C4C4C4", fontWeight: 500, fontSize: 12 }}>
          {_data?.date}
        </Typography>
        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
          {_data?.value}
        </Typography>
      </Stack>
    </Stack>
  );
};

// --- LineChart Component ---
const LineChart = ({
  label,
  data,
  rangeMin,
  rangeMax,
  color,
}: LineChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State for dynamic pixel dimensions (existing)
  const [dimensions, setDimensions] = useState({
    width: DEFAULT_MIN_WIDTH,
    height: DEFAULT_MIN_HEIGHT,
  });

  // State for the Tooltip (NEW)
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
    statusColor: color,
  });

  // Effect for dynamic resizing and measurement (existing)
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

  // Effect for D3 rendering logic
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // ----------------------------------------------------------------
    // --- DIMENSION CALCULATION ---
    // ----------------------------------------------------------------
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

    // ----------------------------------------------------------------
    // --- Draw Axes (Styled) ---
    // ----------------------------------------------------------------

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
      // 1. ADD FONT FAMILY TO X-AXIS TEXT
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
      // 2. ADD FONT FAMILY TO Y-AXIS TEXT
      .style("font-family", "Manrope, sans-serif");

    // ----------------------------------------------------------------
    // --- Gradient Definition ---
    // ----------------------------------------------------------------
    const defs = svg.append("defs");

    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "optimalRangeGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    const gradientTopColor = "rgba(60,179,113,0.0)";
    const gradientBottomColor = "rgba(0,128,0,0.1)";

    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", gradientTopColor);

    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", gradientBottomColor);

    // ----------------------------------------------------------------
    // --- Chart Elements ---
    // ----------------------------------------------------------------

    // Area
    const constantAreaGenerator = d3
      .area<DataPoint>()
      .x((d) => xScale(d.date)! + xScale.bandwidth() / 2)
      .y0(yScale(rangeMin))
      .y1(yScale(rangeMax))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "url(#optimalRangeGradient)")
      .attr("d", constantAreaGenerator);

    // Range Lines (existing)
    const rangeLineColor = "#66BB6A";

    const upperLineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.date)! + xScale.bandwidth() / 2)
      .y(() => yScale(rangeMax));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", rangeLineColor)
      .attr("stroke-dasharray", "5 5")
      .attr("stroke-width", 1.5)
      .attr("d", upperLineGenerator);

    const lowerLineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.date)! + xScale.bandwidth() / 2)
      .y(() => yScale(rangeMin));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", rangeLineColor)
      .attr("stroke-dasharray", "5 5")
      .attr("stroke-width", 1.5)
      .attr("d", lowerLineGenerator);

    // Main Value Line (existing)
    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.date)! + xScale.bandwidth() / 2)
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 0.8)
      .attr("d", lineGenerator);

    // ----------------------------------------------------------------
    // --- Circles and Tooltip Interaction (MODIFIED) ---
    // ----------------------------------------------------------------

    // Function to determine status color for the tooltip border
    const getStatusColor = (value: number) => {
      if (value < rangeMin) return "#FF5252"; // Red for Low
      if (value > rangeMax) return "#FFC107"; // Amber for High
      return "#4CAF50"; // Green for Optimal
    };

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.date)! + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 4)
      .attr("fill", color)
      .attr("stroke", "white") // Added stroke for better visibility
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer") // Indicate interactivity

      // Mouseover/Touch event to show tooltip
      .on("mouseover", function (_event, d) {
        // Highlight the hovered circle
        d3.select(this).attr("r", 6).attr("fill", getStatusColor(d.value));

        const statusColor = getStatusColor(d.value);

        // x: Get the SVG x-coordinate (from the left of the chart area)
        const xPos =
          xScale(d.date)! + xScale.bandwidth() / 2 + CHART_MARGIN.left;

        // y: Get the SVG y-coordinate (from the top of the chart area)
        const yPos = yScale(d.value) + CHART_MARGIN.top;
        // ------------------------------------

        setTooltipState({
          visible: true,
          x: xPos, 
          y: yPos,
          data: {
            ...d,
            date: new Date(d.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            label,
            color,
            rangeMin,
            rangeMax,
          },
          statusColor: statusColor,
        });
      })

      // Mouseout/Touch end event to hide tooltip
      .on("mouseout", function () {
        // Reset circle appearance
        d3.select(this).attr("r", 4).attr("fill", color);

        setTooltipState((prev) => ({ ...prev, visible: false }));
      });
    // End of Tooltip Interaction Logic
  }, [
    data,
    rangeMax,
    rangeMin,
    dimensions.width,
    dimensions.height,
    color,
    dimensions,
    label,
  ]); // Added 'label' to dependencies

  // The stacking order here is important:
  // Tooltip must be an absolute positioned child of the main container
  // or a sibling to the chart's container div. Making it a sibling to
  // the SVG's container div is often the easiest and most robust approach.
  return (
    <Stack
      sx={{
        gap: 1,
        flex: 1,
        maxWidth: "100%",
        borderRadius: "16px",
        px: 2,
        py: 2,
        height: "100%",
        minHeight: "400px",
        position: "relative", // Set container as positioning context for Tooltip
        // 3. ADD FONT FAMILY TO THE STACK CONTAINER
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <Typography sx={{ fontWeight: 500, fontSize: 18 }}>
        {label} History
      </Typography>
      <Typography
        sx={{ fontWeight: 400, fontSize: 14, color: "text.secondary", mb: 1 }}
      >
        This section visualizes your {label} levels over time, highlighting
        history against time progression.
      </Typography>

      {/* This div acts as the measurable container for the SVG. */}
      <div
        ref={containerRef}
        style={{ width: "100%", flexGrow: 1, position: "relative" }} // relative position for absolute children like the svg
      >
        {/* The SVG element itself */}
        <svg ref={svgRef} style={{ display: "block" }}></svg>
      </div>

      <Tooltip {...tooltipState} />
    </Stack>
  );
};

export default LineChart;
