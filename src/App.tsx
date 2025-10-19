import React from 'react'

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

import Dashboard from './pages/Dashboard'
import { Container } from '@mui/material'
import ResponsiveAppBar from './components/app-bar'

function App() {

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <ResponsiveAppBar />
        <Container maxWidth="lg">
          <Dashboard />
        </Container>
      </ThemeProvider>

    </React.Fragment>
  )
}

export default App
