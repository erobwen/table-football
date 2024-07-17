import { Box, FormControl, InputLabel, MenuItem, Modal, Paper, Select } from "@mui/material";
import { ModalContent } from "../../components/ModalContent";
import { useLoadedData } from "../../components/hooks";
import { getUsers, postTeam } from "../../components/Client";
import { useEffect, useState } from "react";
import { InfoModal } from "../../components/Widgets";


export const CreateTeamModal = ({open, onClose}) => {
  const [users, _] = useLoadedData(getUsers);
  const [items, setItems] = useState();
  useEffect(() => {
    console.log(users);
    if (!users) return;
    const items = users.map(user => {
      return (
        <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
      )
    });
    items.push(<MenuItem key={0} value={null}>No selected!</MenuItem>)
    setItems(items);
  }, [users]) 

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  const [responseMessage, setResponseMessage] = useState(null);
  const [finished, setFinished] = useState(false);
  
  function onSelectPlayer1(event) {
    setPlayer1(event.target.value);
  }

  function onSelectPlayer2(event) {
    setPlayer2(event.target.value);
  }

  async function onSendToBackend() {
    try {
      setResponseMessage(await postTeam(null, player1, player2));
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

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box>
          <ModalContent header={"Register Team"} onOk={onSendToBackend} okEnabled={player1 && player2}>
            <FormControl fullWidth>
              <InputLabel id="player-1">Player 1</InputLabel>
              <Select
                labelId="player-1"
                value={player1}
                label="Player1"
                onChange={onSelectPlayer1}
              >
                {items}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="player-2">Player 2</InputLabel>
              <Select
                labelId="player-2"
                value={player2}
                label="Player2"
                onChange={onSelectPlayer2}
              >
                {items}
              </Select>
            </FormControl>

          </ModalContent>
        </Box>
      </Modal>
      
      {/* Response */}
      <InfoModal message={responseMessage} onClose={onViewedMessage}/>
    </>
  )
}