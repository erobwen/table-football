import { Modal, Paper } from "@mui/material";


export const CreateTeamModal = ({open, onClose}) => {
  

  return (
    <Modal open={open} onClose={onClose}>
      <Paper><h3>Register Team</h3></Paper>
    </Modal>
  )
}