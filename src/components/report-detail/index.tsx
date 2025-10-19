import React, { useMemo } from "react";
import { Typography, Stack } from "@mui/material";

// --- Icon Imports ---
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

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
  icon: string; // URL or path to the icon image
};

// Helper component for a single result row
const ResultRow: React.FC<{ result: Report }> = ({ result }) => {
  // ... (other calculations remain the same)

    const trendIcon = useMemo(() => {
        const isIncreased = result.changePercentage > 0;
        if( isIncreased ){
            return <ArrowDropDownIcon sx={{ color: "#FF5C00", height: 20, width: 20 }} />
        } return  <ArrowDropUpIcon sx={{ color: "#FF2C2C", height: 20, width: 20 }} />;

    }, [result]);


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
        color="rgba(0, 0, 0, 0.6)"
      >
        <Stack
          sx={{
            borderWidth: 0.5,
            borderStyle: "solid",
            borderColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            padding: 1,
          }}
        >
          <img
            src={result.icon}
            alt="Creatine icon"
            style={{ width: "24px", height: "24px" }}
          />
        </Stack>
        <Stack flex={1}>
          <Typography sx={{ fontWeight: 600 }}>{result?.title}</Typography>
          <Typography sx={{ fontWeight: 500, fontSize: 12 }}>
            Optimal: {result.rangeMin} - {result.rangeMax} {result.unit}
          </Typography>
        </Stack>
        <Stack>
          <Stack flexDirection="row" alignItems="center" sx={{ color: "text.secondary"}}>
            <Typography sx={{ fontWeight: 400, fontSize: 20 }}>
              {result.value}
            </Typography>
            {trendIcon}

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
      gap={1}
      sx={{
        flex: 1,
        maxWidth: "100%",
        backgroundColor: "white",
        borderRadius: "16px",
        px: 2,
        py: 2, // Added vertical padding for better spacing around the grid
      }}
    >
        <Typography sx={{ fontWeight: 500, fontSize: 18 }}>
            Latest Result Details
        </Typography>
        <Typography sx={{ fontWeight: 500, fontSize: 12, color: '#C4C4C4' }}>
            {new Date(data[0]?.date).toLocaleDateString()}
        </Typography>
        <Typography sx={{  fontWeight: 400, fontSize: 14, color: 'text.secondary', mb: 1 }}>
            This section provides detailed insights into your most recent lab results, highlighting key biomarkers and their comparison to last measurements.
        </Typography>
      {data.map((result) => (
        <Stack
          key={`report-detail-${result.date}-${result.id}`}
          id="sub-container"
          // --- STYLES ADDED/UPDATED HERE ---
          sx={{
            // Card Appearance
            backgroundColor: "white",
            // Subtle Box Shadow to make it "float"
            // Optional: transition for a smooth look on hover or updates
          }}
        >
          <ResultRow result={result} />
        </Stack>
      ))}
    </Stack>
  );
};

export default ReportDetail;
