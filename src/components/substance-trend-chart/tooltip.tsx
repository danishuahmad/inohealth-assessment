// Tooltip.tsx
import React from "react";
import { Stack, Typography } from "@mui/material";
import { type TooltipProps } from "./types"; // Assuming types.ts is in the same directory

const Tooltip: React.FC<TooltipProps> = ({
  visible,
  x,
  y,
  data,
  statusColor,
}) => {
  if (!visible || !data) return null;

  // Format the date for display
  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

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
        // Position the tooltip relative to the point it tracks
        transform: "translate(-50%, calc(-1% - 10px))", 
        boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
        zIndex: 1000,
        gap: 8,
      }}
    >
      {/* Status Bar */}
      <Stack sx={{ width: 3, background: statusColor, borderRadius: 1 }} />
      
      {/* Content */}
      <Stack>
        <Typography sx={{ color: data.color, fontWeight: 600 }}>
          {data.label}
        </Typography>
        <Typography sx={{ color: "#C4C4C4", fontWeight: 500, fontSize: 12 }}>
          {formattedDate}
        </Typography>
        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
          {data.value}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Tooltip;