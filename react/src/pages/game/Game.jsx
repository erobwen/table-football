import { Box, Button, CircularProgress, Grid, Paper } from "@mui/material";
import { getOngoingGame, getTeam, updateOngoingGame } from "../../components/Client"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { darkBlue, lightBlue } from "../../components/Widgets";

export const Game = () => {
  const [game, setGame] = useState()
  const [team1Id, setTeam1Id] = useState(null);
  const [team2Id, setTeam2Id] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGame() {
      const game = await getOngoingGame();
      if (!game) navigate("/dashboard") 
      setGame(game);
    }
    fetchGame();
  }, []);

  useEffect(() => {
    if (!game) return;
    if (team1Id && team2Id) return; 
    async function getTeams() {
      setTeam1Id(await getTeam(game.team1Id));
      setTeam2Id(await getTeam(game.team2Id));
    } 
    getTeams();
  }, [game, team1Id, team2Id])

  function scoreTeam1() {
    const newGame = {...game, team1Score: game.team1Score + 1}; 
    setGame(newGame)
    updateOngoingGame(newGame);
  }

  function scoreTeam2() {
    const newGame = {...game, team2Score: game.team2Score + 1}; 
    setGame(newGame)
    updateOngoingGame(newGame);
  }

  function finishGame() {
    const newGame = {...game, finished: true}; 
    setGame(newGame)
    updateOngoingGame(newGame);
    navigate("/dashboard");
  }

  if (!team1Id || !team2Id) return <CircularProgress/>

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper style={{backgroundColor: darkBlue}}><h2 style={{height:"100px", lineHeight:"100px"}}>{team1Id.name} vs {team2Id.name}</h2></Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper style={{backgroundColor: "white"}}>
          <Box>{team1Id.name} score</Box>
          <Box style={{fontSize: "40px"}}>{game.team1Score}</Box>
          <Button onClick={scoreTeam1}>+</Button>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper style={{backgroundColor: "white"}}>
          <Box>{team2Id.name} score</Box>
          <Box style={{fontSize: "40px"}}>{game.team2Score}</Box>
          <Button onClick={scoreTeam2}>+</Button>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper style={{backgroundColor: darkBlue}}><Button onClick={finishGame}>Finish</Button></Paper>
      </Grid>
    </Grid>
  );
}