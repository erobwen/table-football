import { Box, Button, Grid, Paper } from "@mui/material";
import { useLoadedData } from '../../components/hooks';
import { Fragment, useCallback, useState } from "react";
import { CreateTeamModal } from "./CreateTeamModal";
import { RegisterGameModal } from "./RegisterGameModal";
import { CreatePlayerModal } from "./CreatePlayerModal";
import { ButtonColumn, ButtonRow, darkBlue, lightBlue } from "../../components/Widgets";
import { getTeams, getTeamsSorted } from "../../components/Client";
import { StartGameModal } from "./StartGameModal";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

export function Dashboard() {
  const [teams, _, reload] = useLoadedData(getTeamsSorted);

  const [createPlayerOpen, setCreatePlayerOpen] = useState(false);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [registerGameOpen, setRegisterGameOpen] = useState(false);
  const [startGameOpen, setStartGameOpen] = useState(false);

  const onCreatePlayer = useCallback(() => setCreatePlayerOpen(true));
  const onCreateTeam = useCallback(() => setCreateTeamOpen(true));
  const onRegisterGame = useCallback(() => setRegisterGameOpen(true));
  const onStartGame = useCallback(() => setStartGameOpen(true));

  const onCloseCreatePlayer = useCallback(() => { setCreatePlayerOpen(false); reload(); });
  const onCloseCreateTeam = useCallback(() => { setCreateTeamOpen(false); reload(); });
  const onCloseRegisterGame = useCallback(() => { setRegisterGameOpen(false); reload(); });
  const onCloseStartGame = useCallback(() => { setStartGameOpen(false); });
 
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper style={{backgroundColor: darkBlue}}><h3 style={{height:"100px", lineHeight:"100px"}}>Table Football Tracker 1.0</h3></Paper>
          </Grid>
          <Grid item xs={12}>
            <HallOfFame teams={teams}/>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{padding: "20px", backgroundColor: lightBlue }}>
              <ButtonRow>
                <Button onClick={onCreatePlayer} variant="contained">New Player</Button>
                <Button onClick={onCreateTeam} variant="contained">Register Team</Button>
                <Button onClick={onRegisterGame} variant="contained">Register Finished Game</Button>
                <Button onClick={onStartGame} variant="contained" style={{backgroundColor: "red"}}><SportsSoccerIcon style={{marginRight: "5px"}}/>Start Game!</Button> {/**/}
              </ButtonRow>
            </Paper>
          </Grid>          
          <Grid item xs={12}>
            <Paper style={{backgroundColor: darkBlue}}>
              Created by Robert Renbris
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {createPlayerOpen && <CreatePlayerModal open={createPlayerOpen} onClose={onCloseCreatePlayer}/>}
      {createTeamOpen && <CreateTeamModal open={createTeamOpen} onClose={onCloseCreateTeam}/>}
      {registerGameOpen && <RegisterGameModal open={registerGameOpen} onClose={onCloseRegisterGame}/>}
      {startGameOpen && <StartGameModal open={startGameOpen} onClose={onCloseStartGame}/>}
    </>
  )
}

function HallOfFame({teams}) {
  const rows = teams; 
  
  const columns = [
    {
      field: 'name',
      headerName: 'Team',
      width: 150,
      renderCell: (params) => (
        <Link to={`/teams/${params.row.id}`}>{params.value}</Link>
      ),
    },
    {
      field: 'playedGamesTotal',
      headerName: 'Played Games',
      width: 140,
    },
    {
      field: 'wonGamesTotal',
      headerName: 'Wins',
      width: 140,
    },
    {
      field: 'lostGamesTotal',
      headerName: 'Losses',
      width: 140,
    },
    {
      field: 'winRatio',
      headerName: 'Win Ratio',
      width: 100,
    },
    {
      field: 'goalsFor',
      headerName: 'GF',
      width: 50,
    },
    {
      field: 'goalsAgainst',
      headerName: 'GA',
      width: 50,
    },
    {
      field: 'goalsDifference',
      headerName: 'Δ',
      width: 50
    }
  ];
  
  if (!rows) return null;

  return (
    <>
      <Paper style={{padding: "10px", height: "400px"}}>
        <DataGrid sx={{".MuiCheckbox-root": { display: "none" }}}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>
    </>
  )
}