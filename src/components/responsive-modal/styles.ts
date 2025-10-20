import { type SxProps, type Theme } from '@mui/material';

// --- Styles for the Modal Content Stack ---
export const contentStackSx: SxProps<Theme> = {
  // Appearance
  background: '#fff',
  borderRadius: 2,
  boxShadow: 6,
  margin: 'auto',
  position: 'relative',
  
  // Responsive Padding
  padding: { xs: 2, sm: 3, md: 4 },

  // Responsive Width
  width: { xs: '90vw', sm: '80vw', md: '60vw', lg: '50vw' },
  
  // Height and Scrolling
  maxHeight: { xs: '85vh', sm: '80vh', md: '75vh' },
  overflowY: 'auto', // allows content to scroll

  // Positioning/Margin from top
  marginTop: { xs: '8vh', sm: '6vh', md: '5vh' },
};

// --- Styles for the Close Button ---
export const closeButtonSx: SxProps<Theme> = {
  position: 'absolute',
  top: 8,
  right: 8,
  color: '#c2c2c2',
  zIndex: 1,
};