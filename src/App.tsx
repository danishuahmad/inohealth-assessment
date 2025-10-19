import React from 'react'

import { ThemeProvider, Stack, CssBaseline } from "@mui/material";
import theme from "./theme";

import Dashboard from './pages/Dashboard'
import ResponsiveAppBar from './components/app-bar'

function App() {

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Stack sx={{
          minHeight: '100vh', 
          backgroundColor: '#f0f8ff', // Fallback color
          backgroundImage: 'linear-gradient(to bottom right, #f0f8ff, #e6e6fa)',
          paddingX: 20, // Optional: Add some padding around the content
        }}>
          <ResponsiveAppBar />

          <Dashboard />
        </Stack>
      </ThemeProvider>

    </React.Fragment>
  )
}

export default App
