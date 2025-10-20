import { type SxProps, type Theme } from '@mui/material';

// --- Menu Props (Dropdown) ---
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      borderRadius: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(5px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
    },
  },
};

// --- Select Component Styles ---

// Base style for the Select component (the main button)
export const selectBaseSx: SxProps<Theme> = {
  // Glass Effect Button Styling
  borderRadius: '30px',
  height: '40px',
  backgroundColor: 'rgba(221, 221, 221, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'text.secondary',
  fontSize: '12px',
  fontWeight: 500,

  // Hide default MUI borders and icons
  '& fieldset': { border: 'none' },
  '& .MuiSelect-icon': { color: 'text.secondary' },
};

// Style for the inner selection area (used in renderValue and select component)
export const selectValueDisplaySx = { 
  height: '40px', 
  paddingY: '0', 
  display: 'flex',
  alignItems: 'center',
};

// Style for the "X selected" chip
export const selectedChipSx: SxProps<Theme> = { 
  backgroundColor: '#C2C2C2',
  color: '#000', 
  fontSize: '11px',
  height: '20px'
};

// --- MenuItem Styles ---

export const menuItemBaseSx: SxProps<Theme> = { 
  fontWeight: 300,
  borderRadius: '10px', 
  m: '0 8px', 
  width: 'calc(100% - 16px)',
  // Selected styling
  '&.Mui-selected': {
    fontWeight: 500,
    background: 'none',
    borderRadius: '0px',
    '&:hover': {
      background: 'none',
      borderRadius: '0px',
      fontWeight: 500 
    }
  }, 
  // Hover styling
  '&:hover': {
    background: 'none',
    borderRadius: '0px',
    fontWeight: 500 
  }
};

// --- Clear All Button Styles ---

export const clearButtonSx: SxProps<Theme> = { 
  fontSize: '12px',
  minHeight: '30px',
  height: '30px', 
  minWidth: 'auto',
  borderRadius: '30px', 
  textTransform: 'none',
  color: 'text.secondary',
  transition: 'all 200ms',
  fontWeight: 400,
  '&:hover': {
      borderRadius: '30px',
      height: '30px',
      color: 'text.primary',
      fontWeight: 500,
      background: 'none',
    },
    '&.Mui-disabled': {
      borderRadius: '30px',
      color: '#d1d1d1',
      height: '30px',
      fontWeight: 600,
    },
    '&.Mui-selected': {
      borderRadius: '30px',
      color: 'text.primary',
      height: '30px',
      fontWeight: 600,
    },
};