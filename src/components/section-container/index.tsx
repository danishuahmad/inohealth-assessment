import type { ReactNode } from "react";
import { Stack, type SxProps, type Theme } from "@mui/material";

import { defaultSectionSx } from './styles'; // Import default styles

type SectionContainerProps = {
  children: ReactNode;
  customStyles?: SxProps<Theme>; // Specify Theme type for better SxProps typing
};

const SectionContainer = ({
  children,
  customStyles,
}: SectionContainerProps) => {
  return (
    <Stack
      sx={{
        ...defaultSectionSx, // Apply default glassmorphic styles
        ...(customStyles as object), // Apply and merge custom styles (needs type assertion for spread)
      }}
    >
      {children}
    </Stack>
  );
};

export default SectionContainer;