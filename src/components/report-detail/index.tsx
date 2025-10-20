import { useMemo } from "react";
import { Typography, Stack } from "@mui/material";
import { type Report } from "./types";
import { detailTableDateSx, detailTableTitleSx } from "./styles";
import ResultRow from "./result-row";

type ReportDetailProps = {
  data: Report[];
  onSelect: (id: string) => void;
};

/**
 * Main Component
 */
const ReportDetail = ({ data, onSelect: handleSelect }: ReportDetailProps) => {
  const firstDate = data[0]?.date;
  const formattedDate = useMemo(() => {
    if (!firstDate) return "";
    return new Date(firstDate).toLocaleDateString();
  }, [firstDate]);

  return (
    <Stack gap={1}>
      <Typography sx={detailTableTitleSx}>Latest Result Details</Typography>
      <Typography sx={detailTableDateSx}>{formattedDate}</Typography>
      {data.map((result) => (
        <Stack key={`report-detail-${result.date}-${result.id}`}>
          <ResultRow result={result} onSelect={handleSelect} />
        </Stack>
      ))}
    </Stack>
  );
};

export default ReportDetail;
