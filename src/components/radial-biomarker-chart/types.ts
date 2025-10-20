import { type MouseEvent } from 'react';

// --- Data & Props Interfaces ---
export type DataPoint = {
  rangeValue: number; // Normalized radial value (0-100)
  value: number; // Actual value
  category: string; // The substance name (e.g., 'creatine')
  date: string; // The test date
  color: string; // Color associated with the substance
  label: string; // Label for the substance
}

export interface RadialChartProps {
  data: DataPoint[];
  innerRadius?: number;
  outerRadius?: number;
  showCentralText?: boolean;
  centralNumber?: number;
  centralLabel?: string;
}

// --- Tooltip Interfaces ---
export interface TooltipState {
    visible: boolean;
    x: number;
    y: number;
    data: null | DataPoint;
    statusColor: string
}

export type TooltipProps = TooltipState

// --- D3 Utility Types ---
export type CategoryAngles = { [key: string]: [number, number] };

// --- Event Handler Interface (for passing into D3 logic) ---
export interface ChartHandlers {
  showTooltip: (event: MouseEvent, data: DataPoint) => void;
  hideTooltip: () => void;
}