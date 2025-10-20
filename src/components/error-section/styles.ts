import { type SxProps, type Theme } from '@mui/material';

export const containerSx: SxProps<Theme> = {
  width: '100%',
  minHeight: '100vh',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  p: 4,
};

export const titleSx: SxProps<Theme> = {
  fontSize: 24,
  fontWeight: 500,
  marginBottom: 2,
  color: '#c1c1c1',
};

export const messageSx: SxProps<Theme> = {
  fontSize: 16,
  color: '#a1a1a1',
};