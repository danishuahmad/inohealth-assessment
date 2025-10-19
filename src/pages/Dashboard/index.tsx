import { Box, Stack } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import health_data from "../../assets/data.json";
import RadialBiomarkerChart,{ type DataPoint } from "../../components/radial-biomarker-chart";
import { Substances } from "./types";

const Dashboard = () => {
  const [data, setData] = useState<DataPoint[]>([]);

  const SUBSTANCES = useMemo(() => Object.values(Substances), []);
  // Reference ranges for normalization (assumed)

  const COLOR_PALETTE = useMemo(
    () => ({
      creatine: "#FFAB91", // Pale Coral
      chloride: "#B2EBF2", // Light Cyan
      fasting_glucose: "#FFCCBC", // Soft Orange
      potassium: "#E6EE9C", // Pale Yellow-Green
      sodium: "#CFD8DC", // Light Greyish Blue
      total_calcium: "#A8D8B9", // Soft Green
      total_protein: "#D1C4E9", // Soft Lavender
    }),
    []
  );

  const REFERENCE_RANGES = useMemo(
    () => ({
      creatine: { min: 0.6, max: 1.3 },
      chloride: { min: 96, max: 106 },
      fasting_glucose: { min: 70, max: 100 },
      potassium: { min: 3.5, max: 5.0 },
      sodium: { min: 135, max: 145 },
      total_calcium: { min: 8.5, max: 10.2 },
      total_protein: { min: 6.0, max: 8.3 },
    }),
    []
  );

  const unitFormatter = useCallback((unit: string) => {
        if (!unit) return "";
        const formattedUnit = unit.toLowerCase().trim();
      
        switch (formattedUnit) {
          case "mgdl":
            return "mg/dL";
          case "mmoll":
            return "mmol/L";
          case "ul":
            return "µL";
          case "gdl":
            return "g/dL";
          default:
            return unit; // fallback in case of unknown unit
        }
  }, [])

  useEffect(() => {
    const chartData: DataPoint[] = [];

    health_data.forEach((record) => {
      SUBSTANCES.forEach((substance) => {
        const value = record[substance];
        const range = REFERENCE_RANGES[substance];

        if (value != null && range) {
          // Calculate the normalized value (0-100)
          const normalized =
            ((value - range.min) / (range.max - range.min)) * 100;

          // Clamp the value between 0 and 100
          const clampedValue = Math.max(0, Math.min(100, normalized));

          chartData.push({
            rangeValue: clampedValue,
            value: value,
            category: substance,
            date: record.date_testing,
            color: COLOR_PALETTE[substance],
            label: 
            substance.replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
            + ` (${unitFormatter(record[`${substance}_unit`])})`, 
          });
        }
      });
    });

    setData(chartData);
  }, [COLOR_PALETTE, REFERENCE_RANGES, SUBSTANCES]);

  return (
    <Box flexDirection="column" sx={{ minHeight: "80vh" }}>
      {" "}
      {/* Added minHeight to main Box */}
      <Stack flexDirection="row" gap={1}>
        <Stack
          flex={1}
          sx={{
            backgroundColor: "white",
            // FIX: Ensure the container has enough height to render the chart
            minHeight: "500px",
          }}
          p={3}
        >
          <RadialBiomarkerChart
            data={data}
            showCentralText
            centralNumber={6} // Set the desired number here
            centralLabel="Optimal Biomarkers" // Set the desired label here
          />
        </Stack>
        <Stack flex={1} sx={{ backgroundColor: "white" }}></Stack>
      </Stack>
      <Stack flex={1} sx={{ backgroundColor: "white" }}></Stack>
    </Box>
  );
};

export default Dashboard;
