import Modal from "@mui/material/Modal";
import { Stack, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { JSX } from "react";

type NestedModalProps = {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
};

const ResponsiveModal = ({
  open,
  onClose: handleClose,
  children,
}: NestedModalProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition // ensures content unmounts after animation
      slotProps={{
        backdrop: {
          timeout: 400, // controls backdrop fade duration
        },
      }}
    >
      <Fade in={open} timeout={400}>
        <Stack
          sx={{
            background: "#fff",
            padding: 4,
            borderRadius: 2,
            maxWidth: "50vw",
            minHeight: "50vh",
            margin: "auto",
            marginTop: "5vh",
            position: "relative",
            boxShadow: 6,
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#c2c2c2",
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>

          {/* The Content Will Go Here ...  */}
          {children}
        </Stack>
      </Fade>
    </Modal>
  );
};

export default ResponsiveModal;
