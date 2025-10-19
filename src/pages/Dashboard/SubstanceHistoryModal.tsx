import Modal from "@mui/material/Modal";
import { Stack, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { JSX } from "react";

type NestedModalProps = {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
};

const SubstanceHistoryModal = ({
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
              color: "#666",
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

export default SubstanceHistoryModal;
