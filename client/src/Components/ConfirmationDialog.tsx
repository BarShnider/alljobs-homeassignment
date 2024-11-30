import React, { FC, forwardRef, ReactElement } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

// Define the transition with proper types
const Transition = forwardRef<HTMLDivElement, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

// Define the props for the ConfirmationDialog
interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Create the functional component
const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}): ReactElement | null => {
  // Ensure the dialog is only rendered when `open` is true
  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      TransitionComponent={Transition}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        <DialogActions>
          <Button onClick={onCancel} color="error" variant="outlined">
            No
          </Button>
          <Button onClick={onConfirm} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
