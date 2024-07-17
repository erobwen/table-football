
import { Modal, Paper, TextField } from "@mui/material";
import { ModalContent } from "../../components/ModalContent";
import { postUser } from "../../components/Client";
import { useCallback, useState } from "react";
import { InfoModal } from "../../components/Widgets";

export const CreateUserModal = ({open, onClose}) => {

  const [name, setName] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [finished, setFinished] = useState(false);

  async function onSendToBackend() {
    try {
      setResponseMessage(await postUser(name));
      setFinished(true);
    } catch (error) {
      setResponseMessage(error.message);
    }
  }

  function onViewedMessage() {
    if (finished) {
      onClose();
    } else {
      setResponseMessage(null);
    }
  }

  const onUpdateText = useCallback((event) => {
    setName(event.target.value);
  });

  return (
    <>
      {/* Request */}
      <Modal open={open} onClose={onClose}>
        <div>
          <ModalContent header={"New Player"} onOk={() => {onSendToBackend()}} okEnabled={name.length > 3}>
            <TextField 
              label="Name"
              type="text"
              value={name} 
              onChange={onUpdateText}
              id="outlined-basic" 
              variant="outlined"/>
          </ModalContent>
        </div>
      </Modal>

      {/* Response */}
      <InfoModal message={responseMessage} onClose={onViewedMessage}/>
    </>
  )
}

