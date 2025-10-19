import { useMemo } from "react";
import { type SxProps } from "@mui/material";

import ReportDetail, { type Report } from "../../components/report-detail";
import type { ApiResponse } from "./types";
import SectionContainer from "../../components/section-container";

type SecondarySectionProps = {
  customStyles?: SxProps;
  reports_data: ApiResponse[];
  colorPalette: Record<string, string>;
  referenceForRanges: Record<
    string,
    {
      min: number;
      max: number;
    }
  >;
  icons: Record<string, string>;
  substances: string[];
  substanceFilter: string[];
  dateFilter: string | null;
  unitFormatter: (unit: string) => string;
  onSelect: (substance: string) => void;
};

const SecondarySection = ({
  customStyles,
  reports_data,
  colorPalette,
  referenceForRanges,
  icons,
  substances,
  unitFormatter,
  onSelect: handleSubstanceHistoryRequested,
}: SecondarySectionProps) => {
  const latestReportDetail: Report[] = useMemo(() => {
    if (reports_data.length === 0) return [] as Report[];
    const lastReport = reports_data.reduce((latest, current) => {
      return new Date(current.date_testing) > new Date(latest.date_testing)
        ? current
        : latest;
    });
    const secondLastReport = reports_data.reduce((latest, current) => {
      if (current.date_testing === lastReport.date_testing) {
        return latest;
      }
      return new Date(current.date_testing) > new Date(latest.date_testing)
        ? current
        : latest;
    });

    return substances.map((_substance) => ({
      id: _substance as string,
      title: `${_substance
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())} (${unitFormatter(
        lastReport[`${_substance}_unit` as keyof ApiResponse] as string
      )})`,
      titleColor: colorPalette[_substance],
      value: Number(lastReport[_substance as keyof ApiResponse]),
      unit: unitFormatter(
        lastReport[`${_substance}_unit` as keyof ApiResponse] as string
      ),
      rangeMin: referenceForRanges[_substance].min,
      rangeMax: referenceForRanges[_substance].max,
      changePercentage: secondLastReport
        ? ((Number(lastReport[_substance as keyof ApiResponse]) -
            Number(secondLastReport[_substance as keyof ApiResponse])) /
            Number(secondLastReport[_substance as keyof ApiResponse])) *
          100
        : 0,
      date: lastReport.date_testing,
      icon: icons[_substance],
    }));
  }, [
    colorPalette,
    icons,
    referenceForRanges,
    reports_data,
    substances,
    unitFormatter,
  ]);

  return (
    <SectionContainer customStyles={customStyles}>
      <ReportDetail
        data={latestReportDetail}
        onSelect={handleSubstanceHistoryRequested}
      />
    </SectionContainer>
  );
};

export default SecondarySection;
