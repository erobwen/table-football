import { Box, Button, Grid, Paper } from "@mui/material";
import { useLoadedData } from '../../components/hooks';
import { Fragment, useCallback, useState } from "react";
import { CreateTeamModal } from "./CreateTeamModal";
import { RegisterGameModal } from "./RegisterGameModal";
import { CreateUserModal } from "./CreateUserModal";
import { ButtonColumn } from "../../components/Widgets";
import { getTeams } from "../../components/Client";
import { StartGameModal } from "./StartGameModal";

export function Dashboard() {
  const [teams, _, reload] = useLoadedData(getTeams);

  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [registerGameOpen, setRegisterGameOpen] = useState(false);
  const [startGameOpen, setStartGameOpen] = useState(false);

  const onCreateUser = useCallback(() => setCreateUserOpen(true));
  const onCreateTeam = useCallback(() => setCreateTeamOpen(true));
  const onRegisterGame = useCallback(() => setRegisterGameOpen(true));
  const onStartGame = useCallback(() => setStartGameOpen(true));

  const onCloseCreateUser = useCallback(() => { setCreateUserOpen(false); reload(); });
  const onCloseCreateTeam = useCallback(() => { setCreateTeamOpen(false); reload(); });
  const onCloseRegisterGame = useCallback(() => { setRegisterGameOpen(false); });
  const onCloseStartGame = useCallback(() => { setStartGameOpen(false); });
 
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper><h3 style={{height:"100px", lineHeight:"100px"}}>Table Football Tracker 1.0</h3></Paper>
          </Grid>
          <Grid item xs={8}>
            <HallOfFame teams={teams}/>
          </Grid>
          <Grid item xs={4}>
            <Paper>
              <ButtonColumn>
                <Button onClick={onCreateUser} variant="contained">New Player</Button>
                <Button onClick={onCreateTeam} variant="contained">Register Team</Button>
                <Button onClick={onRegisterGame} variant="contained">Register Finished Game</Button>
                <Button onClick={onStartGame} variant="contained">Start Game!</Button>
              </ButtonColumn>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>Created by Robert Renbris</Paper>
          </Grid>
        </Grid>
      </Box>
      {createUserOpen && <CreateUserModal open={createUserOpen} onClose={onCloseCreateUser}/>}
      {createTeamOpen && <CreateTeamModal open={createTeamOpen} onClose={onCloseCreateTeam}/>}
      {registerGameOpen && <RegisterGameModal open={registerGameOpen} onClose={onCloseRegisterGame}/>}
      {startGameOpen && <StartGameModal open={startGameOpen} onClose={onCloseStartGame}/>}
    </>
  )
}

function HallOfFame({teams}) {
  const rows = teams; 
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
    }
  ];
  
  if (!rows) return null;

  return (
    <>
      <Paper style={{padding: "10px"}}>      
        <Grid key="grid" container spacing={2}>
          { rows.map(player => {
            return (
              <Fragment key={player.id}>
                <Grid item xs={4}>
                  {player.name}
                </Grid>
                <Grid item xs={8}>
                  Statistics...
                </Grid>
              </Fragment>
            );
          })}  
        </Grid>
        {/* <DataGrid
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
        /> */}
      </Paper>
    </>
  )
}