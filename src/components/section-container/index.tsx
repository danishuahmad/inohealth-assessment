import { Stack, type SxProps } from "@mui/material";

type SectionContainerProps = {
  children: React.ReactNode;
  customStyles?: SxProps;
};

const SectionContainer = ({
  children,
  customStyles,
}: SectionContainerProps) => {
  return (
    <Stack
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        boxShadow:
          "0 0 20px rgba(255, 255, 255, 0.6), 0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "15px",
        ...customStyles,
      }}
    >
      {children}
    </Stack>
  );
};

export default SectionContainer;
