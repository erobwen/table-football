import { Box, FormControl, InputLabel, MenuItem, Modal, Paper, Select } from "@mui/material";
import { ModalContent } from "../../components/ModalContent";
import { useLoadedData } from "../../components/hooks";
import { getTeams, postFinishedGame, postTeam } from "../../components/Client";
import { useEffect, useState } from "react";
import { InfoModal } from "../../components/Widgets";
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';


export const RegisterGameModal = ({open, onClose}) => {
  const [teams] = useLoadedData(getTeams);
  const [items, setItems] = useState();
  useEffect(() => {
    console.log(teams);
    if (!teams) return;
    const items = teams.map(team => {
      return (
        <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
      )
    });
    items.push(<MenuItem key={0} value={""}></MenuItem>)
    setItems(items);
  }, [teams]) 

  const [team1Id, setTeam1Id] = useState("");
  const [team2Id, setTeam2Id] = useState("");
  
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

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
      setResponseMessage(await postFinishedGame(emptyToNull(team1Id), emptyToNull(team2Id), team1Score, team2Score));
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
          <ModalContent header={"Register Finished Game"} onOk={onSendToBackend} okEnabled={team1Id && team2Id}>
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

            <FormControl fullWidth>
              <InputLabel id="team-1-score">Team 1 Score</InputLabel>
              <NumberInput
                value={team1Score}
                onChange={(event, val) => setTeam1Score(val)}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="team-2-score">Team 2 Score</InputLabel>
              <NumberInput
                value={team2Score}
                onChange={(event, val) => setTeam2Score(val)}
              />
            </FormControl>

          </ModalContent>
        </Box>
      </Modal>
      
      {/* Response */}
      <InfoModal message={responseMessage} onClose={onViewedMessage}/>
    </>
  )
}