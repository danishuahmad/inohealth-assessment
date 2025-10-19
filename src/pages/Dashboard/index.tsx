import { Stack } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import health_data from "../../assets/data.json";
import { SubstanceKeys } from "./types";

import SubstanceTrendChart, {
  type LineChartProps,
} from "../../components/substance-trend-chart/index.tsx";
import ResponsiveModal from "../../components/responsive-modal/index.tsx";
import HeroSection from "./hero-section.tsx";
import SecondarySection from "./secondary-section.tsx";
import Filters from "./filters.tsx";
import {
  COLOR_PALETTE,
  ICONS,
  REFERENCE_FOR_RANGES,
  unitFormatter,
} from "./utils.ts";

const Dashboard = () => {
  const [substanceHistoryToShow, setSubstanceHistoryToShow] = useState<
    LineChartProps | undefined
  >();
  const [substanceFilter, setSubstanceFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const SUBSTANCES = useMemo(() => Object.values(SubstanceKeys), []);

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
    <Stack sx={{ maxHeight: "100%", pb: 2 }}>
      {/* Filter Section */}
      <Filters
        customStyles={{ flexDirection: "row", gap: 1 }}
        reports_data={health_data}
        substances={SUBSTANCES}
        substanceFilter={substanceFilter}
        onSubstanceFilterChange={setSubstanceFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />

      {/* Main Section With Radial Graph */}
      <Stack flexDirection="row" gap={1}>
        <HeroSection
          customStyles={{ flex: 5, p: 2 }}
          reports_data={health_data}
          colorPalette={COLOR_PALETTE}
          referenceForRanges={REFERENCE_FOR_RANGES}
          substances={SUBSTANCES}
          unitFormatter={unitFormatter}
          substanceFilter={substanceFilter}
          dateFilter={dateFilter}
        />
        {/* List of Substances in Latest Report */}
        <SecondarySection
          customStyles={{ flex: 3 }}
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
      <Stack>
        <ResponsiveModal
          open={!!substanceHistoryToShow}
          onClose={() => setSubstanceHistoryToShow(undefined)}
        >
          {substanceHistoryToShow ? (
            <SubstanceTrendChart
              data={substanceHistoryToShow.data}
              rangeMin={substanceHistoryToShow.rangeMin}
              rangeMax={substanceHistoryToShow.rangeMax}
              color={substanceHistoryToShow.color}
              label={substanceHistoryToShow.label}
            />
          ) : (
            <></>
          )}
        </ResponsiveModal>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
