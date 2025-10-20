import { type SxProps, type Theme } from '@mui/material';

// --- Main Container Styles ---
export const chartContainerSx: SxProps<Theme> = {
  gap: 1,
  flex: 1,
  maxWidth: '100%',
  borderRadius: '16px',
  px: 2,
  py: 2,
  height: '100%',
  minHeight: '400px',
  position: 'relative',
  fontFamily: 'Manrope, sans-serif',
};

// --- Typography Styles ---
export const titleSx: SxProps<Theme> = { 
  fontWeight: 500, 
  fontSize: 18 
};

export const subtitleSx: SxProps<Theme> = { 
  fontWeight: 400, 
  fontSize: 14, 
  color: 'text.secondary', 
  mb: 1 
};

// --- SVG Wrapper Styles ---
export const svgWrapperStyle: React.CSSProperties = { 
  width: '100%', 
  flexGrow: 1, 
  position: 'relative' 
};

export const svgBaseStyle: React.CSSProperties = { 
  display: 'block' 
};