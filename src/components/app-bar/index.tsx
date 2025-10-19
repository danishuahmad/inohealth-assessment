import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


function ResponsiveAppBar() {
 

  return (
    <AppBar sx={{
        boxShadow: 'none',
        background: "none"
    }} position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            color='primary'
            sx={{
                fontWeight: 500,
            }}
             >
            InoHealth
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
