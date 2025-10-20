import Modal from "@mui/material/Modal";
import { Stack, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ReactNode } from "react";

// Import styles
import { contentStackSx, closeButtonSx } from './styles';

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
      // Configures the transition timing for the backdrop
      slotProps={{
        backdrop: { timeout: 400 },
      }}
    >
      <Fade in={open} timeout={400}>
        {/* Modal Content Wrapper */}
        <Stack
          sx={contentStackSx} // Use imported style
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={closeButtonSx} // Use imported style
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