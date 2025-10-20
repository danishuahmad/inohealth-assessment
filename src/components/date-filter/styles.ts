// DateFilterStyles.ts

import { type SxProps, type Theme, tabsClasses } from '@mui/material';

// --- Global Container Styles (The translucent "glass" bar) ---
export const tabGroupContainerSx: SxProps<Theme> = {
  backgroundColor: 'rgba(221, 221, 221, 0.7)', // Translucent light gray
  alignItems: 'center',
  borderRadius: '30px',
  overflow: 'hidden',
  minHeight: '30px',
  py: 0.5,
};

// --- Tabs Component Styles (The scrollable wrapper) ---
export const tabsContainerSx: SxProps<Theme> = {
  flexGrow: 1,
  minHeight: '30px',
  py: 0,
  // Hide the default indicator line
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    alignItems: 'center',
  },
  // CRUCIAL MODIFICATION: Ensure smooth horizontal scrolling
  '& .MuiTabs-scroller': {
    overflowX: 'auto !important',
    scrollBehavior: 'smooth',
  },
  // Style scroll buttons when disabled
  [`& .${tabsClasses.scrollButtons}`]: {
    '&.Mui-disabled': { opacity: 0.3 },
  },
};

// --- Individual Tab Styles ---
export const tabItemSx: SxProps<Theme> = {
  fontSize: '12px',
  minHeight: '30px',
  height: '30px',
  minWidth: 'auto',
  borderRadius: '30px',
  textTransform: 'none',
  color: 'text.secondary',
  transition: 'all 200ms',
  fontWeight: 400,
  width: '120px',

  // Hover state
  '&:hover': {
    borderRadius: '30px',
    height: '30px',
    color: 'text.primary',
    fontWeight: 500,
  },

  // Selected state
  '&.Mui-selected': {
    borderRadius: '30px',
    backgroundColor: '#C2C2C2',
    color: 'text.primary',
    fontWeight: 600,
  },
};

// --- "All Results" Button Styles ---
export const allResultsButtonSx: SxProps<Theme> = { 
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
    // Note: The selected state is likely unused for a non-tab button, but kept for completeness
    '&.Mui-selected': {
      borderRadius: '30px',
      color: 'text.primary',
      height: '30px',
      fontWeight: 600,
    },
};