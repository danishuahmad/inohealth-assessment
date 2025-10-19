// theme.ts
import { createTheme } from "@mui/material/styles";
import "@fontsource/manrope/300.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";

const theme = createTheme({
  typography: {
    fontFamily: 'Manrope, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
    },
  },
});

export default theme;