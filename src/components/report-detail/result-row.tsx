import { useMemo } from "react";

import { Typography, Stack, Button } from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

// Import Styles
import { 
  iconContainerSx, 
  iconImageStyle, 
  upTrendColor, 
  downTrendColor, 
  titleSx, 
  rangeSx, 
  valueContainerSx, 
  valueTextSx, 
  viewHistoryButtonSx, 
} from './styles';
import { type Report } from "./types";

type ResultRowProps = {
    result: Report;
    onSelect: (id: string) => void;
  };
  
  // Helper component for a single result row
  const ResultRow = ({ result, onSelect }: ResultRowProps) => {
  
    const handleSelect = () => {
      onSelect(result.id);
    };
  
    const trendIcon = useMemo(() => {
      const isIncreased = result.changePercentage > 0;
      
      // Note: The original code used ArrowDropDown for increase and ArrowDropUp for decrease,
      // which is visually confusing (down arrow usually means decrease). 
      // I am preserving the original logic based on the provided code, but coloring them distinctly.
      if (isIncreased) {
        return (
          <ArrowDropDownIcon sx={{ color: upTrendColor, height: 20, width: 20 }} />
        );
      }
      return <ArrowDropUpIcon sx={{ color: downTrendColor, height: 20, width: 20 }} />;
    }, [result.changePercentage]);
  
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
          <Stack sx={iconContainerSx}>
            <img
              src={result.icon}
              alt={`${result.title} icon`}
              style={iconImageStyle}
            />
          </Stack>
          <Stack flex={1}>
            <Typography sx={titleSx}>{result?.title}</Typography>
            <Typography sx={rangeSx}>
              Optimal: {result.rangeMin} - {result.rangeMax} {result.unit}
            </Typography>
          </Stack>
          <Stack alignItems={"flex-end"}>
            <Stack
              flexDirection="row"
              alignItems="center"
              sx={valueContainerSx}
            >
              <Typography sx={valueTextSx}>
                {result.value}
              </Typography>
              {trendIcon}
            </Stack>
            
            <Button
              onClick={handleSelect}
              sx={viewHistoryButtonSx}
            >
              View History
            </Button>
          </Stack>
        </Stack>
      </Stack>
    );
  };

  export default ResultRow;