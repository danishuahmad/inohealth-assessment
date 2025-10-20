import Modal from "@mui/material/Modal";
import { Stack, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ReactNode } from "react";

type ResponsiveModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const ResponsiveModal = ({
  open,
  onClose: handleClose,
  children,
}: ResponsiveModalProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slotProps={{
        backdrop: { timeout: 400 },
      }}
    >
      <Fade in={open} timeout={400}>
        <Stack
          sx={{
            background: "#fff",
            borderRadius: 2,
            boxShadow: 6,
            margin: "auto",
            position: "relative",
            padding: { xs: 2, sm: 3, md: 4 },
            width: { xs: "90vw", sm: "80vw", md: "60vw", lg: "50vw" },
            maxHeight: { xs: "85vh", sm: "80vh", md: "75vh" },
            overflowY: "auto", // allows content to scroll
            marginTop: { xs: "8vh", sm: "6vh", md: "5vh" },
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

          {children}
        </Stack>
      </Fade>
    </Modal>
  );
};

export default ResponsiveModal;
