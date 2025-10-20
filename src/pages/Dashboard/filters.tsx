import { useMemo } from "react";
import { Stack, type SxProps } from "@mui/material";
import DateFilter from "../../components/date-filter";
import MultiSelectFilter from "../../components/multiselect-filter/index.tsx";
import type { ApiResponse } from "./types.ts";
import AnimationWrapper from "../../components/animation-wrapper/index.tsx";

type FiltersProps = {
  customStyles?: SxProps;
  reports_data: ApiResponse[];
  substances: string[];
  substanceFilter: string[];
  onSubstanceFilterChange: (substanceIds: string[]) => void;
  dateFilter: string | null;
  onDateFilterChange: (dateId: string | null) => void;
  isLoading?: boolean;
};

const Filters = ({
  customStyles,
  reports_data,
  substances,
  substanceFilter,
  onSubstanceFilterChange,
  dateFilter,
  onDateFilterChange,
  isLoading = false,
}: FiltersProps) => {
  const substanceFilterOptions = useMemo(() => {
    return substances.map((substance) => ({
      label: substance
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      id: substance,
    }));
  }, [substances]);

  const availableReportDates = useMemo(() => {
    const datesSet = new Set<{ id: string; label: string }>();
    reports_data.forEach((dataPoint) => {
      datesSet.add({
        id: dataPoint.date_testing,
        label: new Date(dataPoint.date_testing).toLocaleDateString(),
      });
    });
    return Array.from(datesSet).sort();
  }, [reports_data]);

  if (isLoading) {
    return <Stack minHeight={68} />;
  }

  return (
    <AnimationWrapper>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          ...customStyles,
          flexWrap: "wrap",
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Stack
          sx={{
            width: { xs: "100%", sm: "auto" },
            minWidth: { xs: "100vw", sm: 300 },
            maxWidth: { xs: "100vw", sm: 500 },
          }}
        >
          <DateFilter
            selectedDateId={dateFilter}
            onChange={onDateFilterChange}
            dates={availableReportDates}
          />
        </Stack>

        <Stack
          sx={{
            flex: 1,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <MultiSelectFilter
            selectedIds={substanceFilter}
            options={substanceFilterOptions}
            onChange={onSubstanceFilterChange}
          />
        </Stack>
      </Stack>
    </AnimationWrapper>
  );
};

export default Filters;
