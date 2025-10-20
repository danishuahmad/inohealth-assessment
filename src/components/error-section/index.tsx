import { Stack, Typography } from "@mui/material";
import { containerSx, titleSx, messageSx } from './styles'; // Import styles

const ErrorSection = () => {
  return (
    <Stack sx={containerSx}>
      <Typography sx={titleSx}>
        Error 500: I broke down :(
      </Typography>
      <Typography sx={messageSx}>
        Please try refreshing the page or come back later.
      </Typography>
    </Stack>
  );
};

export default ErrorSection;