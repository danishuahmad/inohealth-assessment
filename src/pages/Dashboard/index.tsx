import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import health_data from "../../assets/data.json";
import { SubstanceKeys } from "./types";
import SubstanceTrendChart, { type LineChartProps } from "../../components/substance-trend-chart";
import ResponsiveModal from "../../components/responsive-modal";
import HeroSection from "./hero-section";
import SecondarySection from "./secondary-section";
import Filters from "./filters";
import {
  COLOR_PALETTE,
  ICONS,
  REFERENCE_FOR_RANGES,
  unitFormatter,
} from "./utils";

const Dashboard = () => {
  const [substanceHistoryToShow, setSubstanceHistoryToShow] = useState<
    LineChartProps | undefined
  >();
  const [substanceFilter, setSubstanceFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const SUBSTANCES = useMemo(() => Object.values(SubstanceKeys), []);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); 
  // "md" ~ 900px breakpoint. You can change to "sm" if needed.

  const handleSubstanceHistorySelect = useCallback((substance: string) => {
    const data: { date: string; value: number }[] = [];
    health_data.map((record) => {
      data.push({
        date: record.date_testing,
        value: record[substance as keyof typeof record] as number,
      });
    });
    const unit = health_data[0][
      `${substance}_unit` as keyof (typeof health_data)[0]
    ] as string;
    setSubstanceHistoryToShow({
      label:
        substance.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) +
        ` (${unitFormatter(unit)})`,
      data,
      rangeMin:
        REFERENCE_FOR_RANGES[substance as keyof typeof REFERENCE_FOR_RANGES]
          .min,
      rangeMax:
        REFERENCE_FOR_RANGES[substance as keyof typeof REFERENCE_FOR_RANGES]
          .max,
      color: COLOR_PALETTE[substance as keyof typeof COLOR_PALETTE],
    });
  }, []);

  return (
    <Stack sx={{ maxHeight: "100%", maxWidth: "100%", pb: 2 }}>
      {/* Filter Section */}
      <Filters
        customStyles={{ flexDirection: isSmallScreen ? "column" : "row", gap: 1 }}
        reports_data={health_data}
        substances={SUBSTANCES}
        substanceFilter={substanceFilter}
        onSubstanceFilterChange={setSubstanceFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />

      {/* Main Section */}
      <Stack
        flexDirection={isSmallScreen ? "column" : "row"}
        gap={2}
        alignItems={isSmallScreen ? "stretch" : "flex-start"}
      >
        <Stack flex={isSmallScreen ? "none" : 5}>
          <HeroSection
            customStyles={{ flex: 1, p: 2 }}
            reports_data={health_data}
            colorPalette={COLOR_PALETTE}
            referenceForRanges={REFERENCE_FOR_RANGES}
            substances={SUBSTANCES}
            unitFormatter={unitFormatter}
            substanceFilter={substanceFilter}
            dateFilter={dateFilter}
          />
        </Stack>

        <Stack flex={isSmallScreen ? "none" : 3}>
          <SecondarySection
            customStyles={{ flex: 1 }}
            reports_data={health_data}
            colorPalette={COLOR_PALETTE}
            referenceForRanges={REFERENCE_FOR_RANGES}
            substances={SUBSTANCES}
            icons={ICONS}
            unitFormatter={unitFormatter}
            substanceFilter={substanceFilter}
            dateFilter={dateFilter}
            onSelect={handleSubstanceHistorySelect}
          />
        </Stack>
      </Stack>

      {/* Modal for Trends */}
      <ResponsiveModal
        open={!!substanceHistoryToShow}
        onClose={() => setSubstanceHistoryToShow(undefined)}
      >
        {substanceHistoryToShow && (
          <SubstanceTrendChart
            data={substanceHistoryToShow.data}
            rangeMin={substanceHistoryToShow.rangeMin}
            rangeMax={substanceHistoryToShow.rangeMax}
            color={substanceHistoryToShow.color}
            label={substanceHistoryToShow.label}
          />
        )}
      </ResponsiveModal>
    </Stack>
  );
};

export default Dashboard;
