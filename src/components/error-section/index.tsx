import { Stack, Typography } from "@mui/material";

const ErrorSection = () => {
  return (
    <Stack sx={{ width: "100%", minHeight: "100vh", flex: 1, alignItems: "center", justifyContent: "center", p: 4 }}>
      <Typography sx={{
        fontSize: 24,
        fontWeight: 500,
        marginBottom: 2,
        color: "#c1c1c1",
      }}>Error 500: I broke down :(</Typography>
      <Typography sx={{
        fontSize: 16,
        color: "#a1a1a1",
      }}>
        Please try refreshing the page or come back later.
      </Typography>
    </Stack>
  );
};

export default ErrorSection;
