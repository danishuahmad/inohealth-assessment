import { useEffect, useMemo, useState } from "react";
import { type SxProps } from "@mui/material";

import RadialBiomarkerChart, {
  type DataPoint,
} from "../../components/radial-biomarker-chart";
import type { ApiResponse } from "./types";
import SectionContainer from "../../components/section-container";

type HeroSectionProps = {
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
  substances: string[];
  substanceFilter: string[];
  dateFilter: string | null;
  unitFormatter: (unit: string) => string;
};

const HeroSection = ({
  customStyles,
  reports_data,
  colorPalette,
  referenceForRanges,
  substances,
  substanceFilter,
  dateFilter,
  unitFormatter,
}: HeroSectionProps) => {
  const [data, setData] = useState<DataPoint[]>([]);

  const substancesToInclude = useMemo(() =>
    substanceFilter.length ? substanceFilter : substances as typeof substances, 
  [substanceFilter, substances]);

    const filteredReports = useMemo(() => {
        return dateFilter
        ? reports_data.filter((record) => record.date_testing === dateFilter)
        : reports_data;
    }, [reports_data, dateFilter]);

    const centerLabels = useMemo(() => {
        if( dateFilter ){

            let totalOptimalBiomarkers = 0;
            substancesToInclude.forEach((substance) => {
                filteredReports.forEach((record) => {
                    const value = Number(record[substance as string as keyof ApiResponse]);
                    const range = referenceForRanges[substance];

                    if (value != null && range) {
                        if (value >= range.min && value <= range.max) {
                            totalOptimalBiomarkers += 1;
                        }
                    }
                })
            });

            return {
                centralNumber: totalOptimalBiomarkers,
                centralLabel: `Optimal Biomarker${totalOptimalBiomarkers !== 1 ? 's' : ''}`,
            };
        }else {
            return {
                centralNumber: reports_data.length,
                centralLabel: `Result${reports_data.length !== 1 ? 's' : ''} Summarized`,
            };
        }
    }, [dateFilter, substancesToInclude, filteredReports, referenceForRanges, reports_data.length]);

  useEffect(() => {
    const chartData: DataPoint[] = [];
    const substancesToInclude = (
      substanceFilter.length ? substanceFilter : substances
    ) as typeof substances;

    filteredReports.forEach((record) => {
      substancesToInclude.forEach((substance) => {
        const value = Number(record[substance as string as keyof ApiResponse]);
        const range = referenceForRanges[substance];

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
            color: colorPalette[substance],
            label:
              substance
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()) +
              ` (${unitFormatter(
                record[`${substance}_unit` as keyof ApiResponse] as string
              )})`,
          });
        }
      });
    });

    setData(chartData);
  }, [colorPalette, referenceForRanges, substances, unitFormatter, substanceFilter, dateFilter, reports_data, filteredReports]);

  return (
    <SectionContainer customStyles={customStyles}>
      <RadialBiomarkerChart
        data={data}
        showCentralText
        centralNumber={centerLabels.centralNumber} // Set the desired number here
        centralLabel={centerLabels.centralLabel} // Set the desired label here
      />
    </SectionContainer>
  );
};

export default HeroSection;
