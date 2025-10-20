// MainContainer.tsx

import { Stack } from "@mui/material";
import { AnimatePresence } from "framer-motion";

import { mainContainerSx } from './styles'; // Import styles

type MainContainerProps = {
  appBar: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
};

const MainContainer = ({ appBar, children, footer }: MainContainerProps) => {
  return (
    <Stack
      sx={mainContainerSx} // Use imported style
    >
      <AnimatePresence mode="sync">
        {/*
          Note: Since AnimatePresence is used directly on the content,
          each content block requires a unique key for Framer Motion to track it
          and apply animations when its presence changes.
        */}
        <Stack key={`main-container-child-appbar`}>{appBar}</Stack>
        <Stack key={`main-container-child-content`}>{children}</Stack>
        <Stack key={`main-container-child-footer`}>{footer}</Stack>
      </AnimatePresence>
    </Stack>
  );
};

export default MainContainer;