import { type SxProps, type Theme } from '@mui/material';

// --- Main Container Styles ---
export const mainContainerSx: SxProps<Theme> = {
  position: 'relative',
  minHeight: '400px',
  fontFamily: 'Manrope, sans-serif',
};

// --- Header/Text Styles ---
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

// --- SVG Container Styles ---
export const svgWrapperSx: SxProps<Theme> = { 
  flexGrow: 1, 
  minHeight: 400, 
  alignItems: 'center' 
};

// --- Legend Container Styles ---
export const legendContainerSx: SxProps<Theme> = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 2,
  justifyContent: 'center',
  mt: 1,
};

// --- Individual Legend Item Styles ---
const legendItemTextSx: SxProps<Theme> = { 
  fontSize: 12, 
  fontWeight: 400, 
  color: '#333333' 
};

// Range Indicator Box Styles
export const lowerRangeBoxSx: SxProps<Theme> = { 
  width: 15, 
  height: 5, 
  background: 'rgba(229, 57, 53, 0.25)' 
};

export const higherRangeBoxSx: SxProps<Theme> = { 
  width: 15, 
  height: 5, 
  background: 'rgba(255, 179, 0, 0.25)' 
};

// Latest Value Circle/Border Style
export const latestValueIndicatorSx: SxProps<Theme> = {
  borderRadius: 14,
  width: 11,
  height: 11,
  borderColor: '#333333',
  borderWidth: 1,
  borderStyle: 'solid',
  background: 'transparent',
};

// Helper function to create biomarker color indicator styles
export const createBiomarkerIndicatorSx = (color: string): SxProps<Theme> => ({
  borderRadius: 14,
  width: 11,
  height: 11,
  background: color,
});

// Export grouped styles for easy access
export const LegendStyles = {
    itemText: legendItemTextSx,
    lowerBox: lowerRangeBoxSx,
    higherBox: higherRangeBoxSx,
    latestIndicator: latestValueIndicatorSx,
    createBiomarkerIndicator: createBiomarkerIndicatorSx,
};