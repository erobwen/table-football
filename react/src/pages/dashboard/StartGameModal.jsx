import { Box, FormControl, InputLabel, MenuItem, Modal, Paper, Select } from "@mui/material";
import { ModalContent } from "../../components/ModalContent";
import { useLoadedData } from "../../components/hooks";
import { getOngoingGame, getTeams, postStartedGame } from "../../components/Client";
import { useEffect, useState } from "react";
import { InfoModal } from "../../components/Widgets";
import { useNavigate } from "react-router-dom";


export const StartGameModal = ({open, onClose}) => {
  const [teams] = useLoadedData(getTeams);
  const [ongoingGame] = useLoadedData(getOngoingGame);

  const [items, setItems] = useState();
  useEffect(() => {
    if (!teams) return;
    const items = teams.map(team => {
      return (
        <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
      )
    });
    items.push(<MenuItem key={0} value={""}>No selected!</MenuItem>)
    setItems(items);
  }, [teams]) 

  const navigate = useNavigate();

  useEffect(() => {
    if (ongoingGame) {
      // Game already started! We are out of here! 
      navigate("/game");
    }
  }, [ongoingGame])

  const [team1Id, setTeam1Id] = useState("");
  const [team2Id, setTeam2Id] = useState("");

  const [responseMessage, setResponseMessage] = useState(null);
  const [finished, setFinished] = useState(false);
  
  function onSelectTeam1(event) {
    setTeam1Id(event.target.value);
  }

  function onSelectTeam2(event) {
    setTeam2Id(event.target.value);
  }

  function emptyToNull(value) {
    return value === "" ? null : value; 
  }

  async function onSendToBackend() {
    try {
      await postStartedGame(emptyToNull(team1Id), emptyToNull(team2Id));
      navigate("/game");
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
          <ModalContent header={"Choose teams!"} onOk={onSendToBackend} okEnabled={team1Id && team2Id}>
            <FormControl fullWidth>
              <InputLabel id="player-1">Team 1</InputLabel>
              <Select
                labelId="player-1"
                value={team1Id}
                label="Player1"
                onChange={onSelectTeam1}
              >
                {items}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="player-2">Team 2</InputLabel>
              <Select
                labelId="player-2"
                value={team2Id}
                onChange={onSelectTeam2}
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