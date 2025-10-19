import { useMemo } from "react";
import { Stack, type SxProps } from "@mui/material";

import DateFilter from "../../components/date-filter";
import MultiSelectFilter from "../../components/multiselect-filter/index.tsx";
import type { ApiResponse } from "./types.ts";

type FiltersProps = {
      customStyles?: SxProps;
    
  reports_data: ApiResponse[];

  substances: string[];
  substanceFilter: string[];
  onSubstanceFilterChange: (substanceIds: string[]) => void;
  dateFilter: string | null;
  onDateFilterChange: (dateId: string | null) => void;
};

const Filters = ({
    customStyles,
  reports_data,
  substances,
  substanceFilter,
  onSubstanceFilterChange: handleSubstanceFilterChange,
  dateFilter,
  onDateFilterChange: handleDateFilterChange,
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

  return (
    <Stack sx={{ ...customStyles }}>
      <Stack flex={1}>
        <DateFilter
          selectedDateId={dateFilter}
          onChange={handleDateFilterChange}
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
  );
};

export default Filters;
