import { type SxProps, type Theme } from '@mui/material';

// --- Icon Styles ---
export const iconContainerSx: SxProps<Theme> = {
  borderWidth: 0.5,
  borderStyle: 'solid',
  borderColor: 'rgba(0, 0, 0, 0.2)',
  borderRadius: '8px',
  padding: 1,
};

// Styles for the image inside the icon container
export const iconImageStyle = {
  width: '24px',
  height: '24px',
};

// Trend Icon Colors
export const upTrendColor = '#FF5C00'; // Orange/Red for increase
export const downTrendColor = '#FF2C2C'; // Brighter Red for decrease

// --- Typography Styles ---
export const titleSx: SxProps<Theme> = { 
  fontWeight: 600 
};

export const rangeSx: SxProps<Theme> = { 
  fontWeight: 500, 
  fontSize: 12 
};

export const valueContainerSx: SxProps<Theme> = { 
  color: 'text.secondary', 
  maxWidth: 83, 
  maxHeight: 30 
};

export const valueTextSx: SxProps<Theme> = { 
  fontWeight: 400, 
  fontSize: 20 
};

// --- Button Styles ('View History') ---
export const viewHistoryButtonSx: SxProps<Theme> = {
  fontSize: '12px',
  minHeight: '30px',
  height: '30px',
  width: '86px',
  borderRadius: '30px',
  textTransform: 'none',
  color: 'text.secondary',
  transition: 'all 200ms',
  fontWeight: 400,

  // Hover state
  '&:hover': {
    borderRadius: '30px',
    height: '30px',
    color: 'text.primary',
    fontWeight: 500,
    background: 'none',
  },

  // Disabled state
  '&.Mui-disabled': {
    borderRadius: '30px',
    color: '#d1d1d1',
    height: '30px',
    fontWeight: 600,
  },

  // Selected state (for completeness, though may not be used here)
  '&.Mui-selected': {
    borderRadius: '30px',
    color: 'text.primary',
    height: '30px',
    fontWeight: 600,
  },
};

// --- Main Component Styles ---
export const detailTableTitleSx: SxProps<Theme> = {
  fontWeight: 500,
  fontSize: 18,
};

export const detailTableDateSx: SxProps<Theme> = {
  fontWeight: 500,
  fontSize: 12,
  color: '#C4C4C4',
};