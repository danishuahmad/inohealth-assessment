import { Stack } from "@mui/material";
import { AnimatePresence } from "framer-motion";

type MainContainerProps = {
  appBar: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
};

const MainContainer = ({ appBar, children, footer }: MainContainerProps) => {
  return (
    <Stack
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f0f8ff", // Fallback color
        backgroundImage: "linear-gradient(to bottom right, #f0f8ff, #e6e6fa)",
        px: { xs: 0, sm: 4, md: 8, lg: 20 }, // responsive horizontal padding
        overflowX: "hidden", // ensures no horizontal scroll
      }}
    >
      <AnimatePresence mode="wait">
        <Stack>{appBar}</Stack>
        <Stack>{children}</Stack>
        <Stack>{footer}</Stack>
      </AnimatePresence>
    </Stack>
  );
};

export default MainContainer;
