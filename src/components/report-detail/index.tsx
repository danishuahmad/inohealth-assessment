import { useMemo } from "react";
import { Typography, Stack, Button } from "@mui/material";

// --- Icon Imports ---
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

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

type ResultRowProps = {
  result: Report;
  onSelect: (id: string) => void;
};

// Helper component for a single result row
const ResultRow = ({ result, onSelect }: ResultRowProps) => {
  // ... (other calculations remain the same)

  const handleSelect = () => {
    onSelect(result.id);
  };

  const trendIcon = useMemo(() => {
    const isIncreased = result.changePercentage > 0;
    if (isIncreased) {
      return (
        <ArrowDropDownIcon sx={{ color: "#FF5C00", height: 20, width: 20 }} />
      );
    }
    return <ArrowDropUpIcon sx={{ color: "#FF2C2C", height: 20, width: 20 }} />;
  }, [result]);

  return (
    <Stack
      direction="row"
      p={0.5}
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
        <Stack alignItems={"flex-end"}>
          <Stack
            flexDirection="row"
            alignItems="center"
            sx={{ color: "text.secondary", maxWidth: 83, maxHeight: 30 }}
          >
            <Typography sx={{ fontWeight: 400, fontSize: 20 }}>
              {result.value}
            </Typography>
            {trendIcon}
          </Stack>
          {/* ... (Right Section) */}
          <Button
            onClick={handleSelect}
            sx={{
              fontSize: "12px",
              minHeight: "30px",
              height: "30px",
              width: "86px",
              borderRadius: "30px",
              textTransform: "none",
              color: "text.secondary",
              transition: "all 200ms",
              fontWeight: 400,
              "&:hover": {
                borderRadius: "30px",
                height: "30px",
                color: "text.primary",
                fontWeight: 500,
                background: "none",
              },
              "&.Mui-disabled": {
                borderRadius: "30px",
                color: "#d1d1d1",
                height: "30px",
                fontWeight: 600,
              },
              "&.Mui-selected": {
                borderRadius: "30px",
                color: "text.primary",
                height: "30px",
                fontWeight: 600,
              },
            }}
          >
            View History
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

type ReportDetailProps = {
  data: Report[];
  onSelect: (id: string) => void;
};

/**
 * Main Component
 */
const ReportDetail = ({ data, onSelect: handleSelect }: ReportDetailProps) => {
  return (
    <Stack
      gap={1}
      sx={{
        flex: 1,
        maxWidth: "100%",
        borderRadius: "16px",
        px: 2,
        py: 2, // Added vertical padding for better spacing around the grid
      }}
    >
      <Typography sx={{ fontWeight: 500, fontSize: 18 }}>
        Latest Result Details
      </Typography>
      <Typography sx={{ fontWeight: 500, fontSize: 12, color: "#C4C4C4" }}>
        {new Date(data[0]?.date).toLocaleDateString()}
      </Typography>
      {data.map((result) => (
        <Stack key={`report-detail-${result.date}-${result.id}`}>
          <ResultRow result={result} onSelect={handleSelect} />
        </Stack>
      ))}
    </Stack>
  );
};

export default ReportDetail;
