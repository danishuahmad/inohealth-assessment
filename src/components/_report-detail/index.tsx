import React, { useMemo } from "react";
import { Typography, Stack, Box } from "@mui/material";

// --- Icon Imports ---
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// 1. Define the type for a single lab result item
export type Report = {
  id: string;
  title: string;
  titleColor: string;
  value: number;
  unit: string;
  rangeMin: number;
  rangeMax: number;
  changePercentage: number; // Positive for increase, negative for decrease
  date: string;
};

// Helper component for a single result row
const ResultRow: React.FC<{ result: Report }> = ({ result }) => {
  const isIncreased = result.changePercentage > 0;
  // ... (other calculations remain the same)

  const TrendIcon = isIncreased ? ArrowUpwardIcon : ArrowDownwardIcon;

  const statusColor = useMemo(
    () =>
      result.value < result.rangeMin
        ? "#E53935"
        : result.value > result.rangeMax
        ? "#FFB300"
        : "#11A546",

    [result]
  );

  return (
    <Stack
      direction="row"
      p={1}
      alignItems="center"
      justifyContent="space-between"
    >
      {/* Left Section: Icon and Result Title/Value */}
      <Stack
        flexDirection="row"
        gap={1}
        alignItems="center"
        flex={1}
        height={75}
      >
        <Stack
          sx={{
            width: 3,
            height: "100%", // <--- ADD THIS LINE (or use a different value)
            background: statusColor,
            borderRadius: 1,
          }}
        />
        <Stack>
          <Typography sx={{ color: result.titleColor, fontWeight: 600 }}>
            {result?.title}
          </Typography>
          <Typography sx={{ color: "#C4C4C4", fontWeight: 500, fontSize: 12 }}>
            {result.date}
          </Typography>
          <Stack flexDirection="row" alignItems="center">
            <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
              {result.value}
            </Typography>

            <TrendIcon />
          </Stack>
        </Stack>
      </Stack>

      {/* ... (Right Section) */}
    </Stack>
  );
};

type ReportDetailProps = {
  data: Report[];
};

/**
 * Main Component
 */
const ReportDetail = ({ data }: ReportDetailProps) => {
    return (
      // Outer Container for Dashboard (White card look)
      <Stack
        sx={{
          flex: 1,
          maxWidth: "100%",
          backgroundColor: "white",
          borderRadius: "16px",
          px: 2,
          py: 2, // Added vertical padding for better spacing around the grid
        }}
      >
          {/* Grid Container for Report Results */}
          <Stack
          sx={{
              display: "grid",
              gridTemplateColumns: {
              xs: "1fr",       // 1 column on mobile
              sm: "repeat(2, 1fr)", // 2 columns on small screens and up
              },
              gap: 2, // Increased gap for better spacing between shadowed cards
          }}
          >
          {data.map((result) => (
              <Stack
                  key={`report-detail-${result.date}-${result.id}`}
                  id="sub-container"
                  // --- STYLES ADDED/UPDATED HERE ---
                  sx={{
                      // Card Appearance
                      backgroundColor: 'white',
                      // Subtle Box Shadow to make it "float"
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.06)',
                      // Optional: transition for a smooth look on hover or updates
                      transition: 'box-shadow 0.3s ease-in-out',
                      height: '100%', // Ensures all items in the grid stretch vertically
                  }}
              >
                  <ResultRow result={result} />
              </Stack>
          ))}
          </Stack>
      </Stack>
    );
  };

export default ReportDetail;
