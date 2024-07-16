
import { Modal, Paper } from "@mui/material";

export const CreateUserModal = ({open, onClose}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Paper><h3>New Player</h3></Paper>
    </Modal>
  )
}