import { type SxProps, type Theme } from '@mui/material';

export const mainContainerSx: SxProps<Theme> = {
  // Sets minimum height to the viewport height
  minHeight: '100vh',
  // Background styling for a subtle gradient effect
  backgroundColor: '#f0f8ff', // Fallback color: AliceBlue
  backgroundImage: 'linear-gradient(to bottom right, #f0f8ff, #e6e6fa)', // Gradient: AliceBlue to Lavender
  // Responsive horizontal padding
  px: { xs: 0, sm: 4, md: 8, lg: 20 },
  // Ensures no unwanted horizontal scrollbar
  overflowX: 'hidden',
};