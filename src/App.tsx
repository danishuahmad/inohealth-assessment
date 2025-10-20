import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";

import theme from "./theme";
import Dashboard from "./pages/Dashboard";
import ResponsiveAppBar from "./components/app-bar";
import MainContainer from "./components/main-container";

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <MainContainer appBar={<ResponsiveAppBar />} footer={null}>

          <Dashboard />

        </MainContainer>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
