import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";

import theme from "./theme";
import Dashboard from "./pages/Dashboard";
import ResponsiveAppBar from "./components/app-bar";
import MainContainer from "./components/main-container";
import { DataProvider } from "./context/data-context";

// 👇 Import from your single entry point

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <MainContainer appBar={<ResponsiveAppBar />} footer={null}>

          {/* Wrap the dashboard inside the DataProvider */}
          <DataProvider>
            <Dashboard />
          </DataProvider>
          
        </MainContainer>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
