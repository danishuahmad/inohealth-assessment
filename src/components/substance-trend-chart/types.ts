// types.ts

// --- Chart Interface Definitions ---
export interface DataPoint {
    date: string;
    value: number;
  }
  
  export interface LineChartProps {
    label: string;
    data: DataPoint[];
    rangeMin: number;
    rangeMax: number;
    color: string;
  }
  
  // --- Constants ---
  export const CHART_MARGIN = { top: 20, right: 30, bottom: 80, left: 50 };
  export const DEFAULT_MIN_HEIGHT = 200;
  export const DEFAULT_MIN_WIDTH = 300;
  
  // --- Tooltip Interface Definitions ---
  
  // Extended DataPoint for tooltip context
  export type TooltipData = DataPoint & {
    label: string;
    color: string;
    rangeMin: number;
    rangeMax: number;
  };
  
  export interface TooltipState {
    visible: boolean;
    x: number;
    y: number;
    data: TooltipData | null;
    statusColor: string;
  }
  
  export type TooltipProps = TooltipState