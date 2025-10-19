import { Box, Stack } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import health_data from "../../assets/data.json";
import RadialBiomarkerChart, {
  type DataPoint,
} from "../../components/radial-biomarker-chart";
import { Substances } from "./types";
import DateFilter from "../../components/date-filter";
import MultiSelectFilter from "../../components/multiselect-filter/index.tsx";
import ReportDetail, {type Report} from "../../components/report-detail/index.tsx";

import chloride from '../../assets/icons/chloride.svg';
import calcium from '../../assets/icons/calcium.svg';
import creatine from '../../assets/icons/creatine.svg';
import glucose from '../../assets/icons/glucose.svg';
import potassium from '../../assets/icons/potassium.svg';
import sodium from '../../assets/icons/sodium.svg';
import protein from '../../assets/icons/protein.svg';

const Dashboard = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [substanceFilter, setSubstanceFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const SUBSTANCES = useMemo(() => Object.values(Substances), []);
  // Reference ranges for normalization (assumed)

  const substanceFilterOptions = useMemo(() => {
    return SUBSTANCES.map((substance) => ({
      label: substance
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      id: substance,
    }));
  }, [SUBSTANCES]);

  const availableReportDates = useMemo(() => {
    const datesSet = new Set<{ id: string; label: string }>();
    health_data.forEach((dataPoint) => {
      datesSet.add({
        id: dataPoint.date_testing,
        label: new Date(dataPoint.date_testing).toLocaleDateString(),
      });
    });
    return Array.from(datesSet).sort();
  }, []);

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

  const ICONS = useMemo(
    () => ({
      creatine: creatine, // Pale Coral
      chloride: chloride, // Light Cyan
      fasting_glucose: glucose, // Soft Orange
      potassium: potassium, // Pale Yellow-Green
      sodium: sodium, // Light Greyish Blue
      total_calcium: calcium, // Soft Green
      total_protein: protein, // Soft Lavender
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
  }, []);

  const latestReportDetail : Report[] = useMemo(() => {

    if (health_data.length === 0) return [] as Report[];
    const lastReport = health_data.reduce((latest, current) => {
      return new Date(current.date_testing) > new Date(latest.date_testing)
        ? current
        : latest;
    });
    const secondLastReport = health_data.reduce((latest, current) => {
        if (current.date_testing === lastReport.date_testing) {
            return latest;
        }
        return new Date(current.date_testing) > new Date(latest.date_testing)
            ? current
            : latest;
        });

    return SUBSTANCES.map((_substance) => ({
        id: _substance as string,
        title: `${_substance
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())} (${unitFormatter(lastReport[`${_substance}_unit`])})`,
        titleColor: COLOR_PALETTE[_substance],
        value: lastReport[_substance],
        unit: unitFormatter(lastReport[`${_substance}_unit`]),
        rangeMin: REFERENCE_RANGES[_substance].min,
        rangeMax: REFERENCE_RANGES[_substance].max,
        changePercentage: secondLastReport
            ? ((lastReport[_substance] - secondLastReport[_substance]) / secondLastReport[_substance]) * 100
            : 0,
        date: lastReport.date_testing,
        icon: ICONS[_substance],
    }))

  }, [COLOR_PALETTE, ICONS, REFERENCE_RANGES, SUBSTANCES, unitFormatter]);

  console.log({ latestReportDetail })

  useEffect(() => {
    const chartData: DataPoint[] = [];
    const substancesToInclude = (substanceFilter.length ? 
    substanceFilter : 
    SUBSTANCES) as typeof SUBSTANCES;

    const filteredHealthData = dateFilter
      ? health_data.filter((record) => record.date_testing === dateFilter)
      : health_data;


    filteredHealthData.forEach((record) => {

    substancesToInclude.forEach((substance) => {
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
              substance
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()) +
              ` (${unitFormatter(record[`${substance}_unit`])})`,
          });
        }
      });
    });

    setData(chartData);
  }, [COLOR_PALETTE, REFERENCE_RANGES, SUBSTANCES, unitFormatter, substanceFilter, dateFilter]);

  const handleSubstanceFilterChange = useCallback((selectedIds: string[]) => {
    setSubstanceFilter(selectedIds);
  }, []);

  return (
    <Box flexDirection="column" sx={{ minHeight: "80vh" }}>
      <Stack flexDirection="row" gap={2}>
        <Stack flex={1}>
          <DateFilter
            selectedDateId={dateFilter}
            onChange={setDateFilter}
            dates={availableReportDates}
          />
        </Stack>
        <Stack flex={1}>
          <MultiSelectFilter
            selectedIds={substanceFilter}
            options={substanceFilterOptions}
            onChange={handleSubstanceFilterChange}
          />
        </Stack>
      </Stack>
      {/* Added minHeight to main Box */}
      <Stack flexDirection="row" gap={1}>
        <Stack
          flex={3}
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
        <Stack flex={2} sx={{ backgroundColor: "white" }}>
            <ReportDetail data={latestReportDetail} />
        </Stack>
      </Stack>
      <Stack flex={1} sx={{ backgroundColor: "white" }}>
      </Stack>
    </Box>
  );
};

export default Dashboard;
