import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type MouseEvent,
} from "react";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import Tooltip from "./tooltip";
import {
  type DataPoint,
  type RadialChartProps,
  type TooltipState,
  type CategoryAngles,
  type ChartHandlers,
} from "./types"; // Import all types
import { drawChart } from "./utils";
import { 
    mainContainerSx, 
    titleSx, 
    subtitleSx, 
    svgWrapperSx, 
    legendContainerSx, 
    LegendStyles 
} from './styles'; // Import styles

// --- React Component ---
export const RadialBiomarkerChart: React.FC<RadialChartProps> = ({
  data,
  innerRadius = 80,
  outerRadius = 160,
  showCentralText = true,
  centralNumber = 6,
  centralLabel = "Optimal Biomarkers",
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
    statusColor: "",
  });

  // --- Tooltip Event Handlers ---
  const showTooltip = useCallback((event: MouseEvent, data: DataPoint) => {
    const categoryName = data.label;
    const date = new Date(data.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const containerRect = containerRef.current!.getBoundingClientRect();

    // Determine status color based on 0-100 rangeValue
    const statusColor =
      data.rangeValue < 33
        ? "#E53935"
        : data.rangeValue > 66
        ? "#FFB300"
        : "#11A546";

    setTooltip({
      visible: true,
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top,
      data: { ...data, date: date, label: categoryName },
      statusColor: statusColor,
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip((prev) => (prev.visible ? { ...prev, visible: false } : prev));
  }, []);

  // --- Memoized Data/Config ---
  const allCategories = useMemo(
    () => Array.from(new Set(data.map((d) => d.category))).sort(),
    [data]
  );
  const numCategories = allCategories.length;

  const categoryAngles = useMemo(() => {
    const angles: CategoryAngles = {};
    const angularSize = (2 * Math.PI) / numCategories;

    let currentAngle = 0;
    allCategories.forEach((category) => {
      angles[category] = [currentAngle, currentAngle + angularSize];
      currentAngle += angularSize;
    });

    return angles;
  }, [allCategories, numCategories]);

  // Legend data for consumption in the return block
  const legendData = useMemo(() => {
    const legendMap: { [key: string]: { color: string; label: string } } = {};
    data.forEach(
      (d) => (legendMap[d.category] = { color: d.color, label: d.label })
    );
    return Object.entries(legendMap).map(([, { color, label }]) => ({
      label,
      color,
    }));
  }, [data]);

  // --- Dynamic Size Calculation (Container measurement) ---
  useEffect(() => {
    let resizeTimeout: number | null = null;
  
    const measure = () => {
      if (!containerRef.current) return;
      const { clientWidth } = containerRef.current;
      const width = clientWidth || 400;
      const height = Math.min(width, 400);
  
      // Only update if dimensions actually changed
      setDimensions(prev => {
        if (prev.width === width && prev.height === height) return prev;
        return { width, height };
      });
    };
  
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(measure, 200); // debounce
    };
  
    // Initial measure
    measure();
    window.addEventListener("resize", handleResize);
  
    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [data]);
  
  // --- Responsive Scaling Calculation ---
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [currentInnerRadius, currentOuterRadius, SCALE_FACTOR] = useMemo(() => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return [0, 0, 1];

    const deviceScale = isMobile ? 0.75 : isTablet ? 0.9 : 1;
    const maxDimension = Math.min(width, height);
    const chartRadius = (maxDimension / 2) * 0.9 * deviceScale;

    const REFERENCE_OUTER_RADIUS = 200;
    const currentOuterR = chartRadius * (outerRadius / REFERENCE_OUTER_RADIUS);
    const currentInnerR = currentOuterR * (innerRadius / outerRadius);
    const scaleFactor = currentOuterR / REFERENCE_OUTER_RADIUS;

    return [currentInnerR, currentOuterR, scaleFactor];
  }, [dimensions, innerRadius, outerRadius, isMobile, isTablet]);

  // --- D3 Drawing Effect ---
  useEffect(() => {
    if (
      !svgRef.current ||
      data.length === 0 ||
      dimensions.width === 0 ||
      dimensions.height === 0
    )
      return;

    const handlers: ChartHandlers = { showTooltip, hideTooltip };

    // The drawChart function is assumed to handle all D3 rendering
    drawChart(
      svgRef.current,
      data,
      dimensions,
      currentInnerRadius,
      currentOuterRadius,
      SCALE_FACTOR,
      allCategories,
      categoryAngles,
      showCentralText,
      centralNumber,
      centralLabel,
      handlers
    );
  }, [
    data,
    allCategories,
    categoryAngles,
    dimensions,
    currentInnerRadius,
    currentOuterRadius,
    SCALE_FACTOR,
    showCentralText,
    centralNumber,
    centralLabel,
    showTooltip, 
    hideTooltip, 
  ]);

  return (
    <Stack
      ref={containerRef}
      width="100%"
      height="100%"
      gap={1}
      sx={mainContainerSx} // Use imported style
    >
      <Typography sx={titleSx}>
        Your Personalized Biomarker Trends
      </Typography>
      <Typography
        sx={subtitleSx}
      >
        Review the complete picture of your health metrics. Each point in the
        graph represents a key biomarker and you can easily compare your **Last
        Recorded Value** (specially bordered marker) with your other results to
        see the shift in your measurements.
      </Typography>

      {/* SVG Container */}
      <Stack sx={svgWrapperSx}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
        ></svg>
      </Stack>

      {/* Tooltip */}
      <Tooltip {...tooltip} />

      {/* Legend */}
      <Stack sx={legendContainerSx}>
        {/* Range Indicators */}
        <Stack flexDirection="row" alignItems="center" gap={0.5}>
          <Box sx={LegendStyles.lowerBox} />
          <Typography sx={LegendStyles.itemText}>
            Lower
          </Typography>
        </Stack>
        <Stack flexDirection="row" alignItems="center" gap={0.5}>
          <Box sx={LegendStyles.higherBox} />
          <Typography sx={LegendStyles.itemText}>
            Higher
          </Typography>
        </Stack>

        {/* Latest Value Indicator */}
        <Stack flexDirection="row" alignItems="center" gap={0.5}>
          <Stack sx={LegendStyles.latestIndicator} />
          <Typography sx={LegendStyles.itemText}>
            Latest Value
          </Typography>
        </Stack>

        {/* Biomarker Colors */}
        {legendData.map((d) => (
          <Stack
            key={`legend-item-${d.label}`}
            flexDirection="row"
            alignItems="center"
            gap={0.5}
          >
            <Stack
              sx={LegendStyles.createBiomarkerIndicator(d.color)}
            />
            <Typography sx={LegendStyles.itemText}>
              {d.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};