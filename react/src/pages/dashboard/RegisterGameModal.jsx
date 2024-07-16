import { Modal, Paper } from "@mui/material";

export const RegisterGameModal = ({open, onClose}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Paper><h3>Register Game</h3></Paper>
    </Modal>
  )
}