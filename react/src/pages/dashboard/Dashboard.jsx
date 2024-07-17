import { Box, Button, Grid, Modal, Paper, TextField } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useLoadedData } from '../../components/hooks';
import { useCallback, useState } from "react";
import { CreateTeamModal } from "./CreateTeamModal";
import { RegisterGameModal } from "./RegisterGameModal";
import { CreateUserModal } from "./CreateUserModal";
import { ButtonColumn } from "../../components/Widgets";
import { getUsers } from "../../components/Client";

export function Dashboard() {
  const [users, reload] = useLoadedData(getUsers);

  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [registerGameOpen, setRegisterGameOpen] = useState(false);

  const onCreateUser = useCallback(() => setCreateUserOpen(true));
  const onCreateTeam = useCallback(() => setCreateTeamOpen(true));
  const onRegisterGame = useCallback(() => setRegisterGameOpen(true));

  const onCloseCreateUser = useCallback(() => { setCreateUserOpen(false); reload(); });
  const onCloseCreateTeam = useCallback(() => { setCreateTeamOpen(false); reload(); });
  const onCloseRegisterGame = useCallback(() => { setRegisterGameOpen(false); reload(); });
 
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper><h2 style={{height:"100px", lineHeight:"100px"}}>Table Football Hall of Fame</h2></Paper>
          </Grid>
          <Grid item xs={8} style={{height:"300px"}}>
            <HallOfFame users={users}/>
          </Grid>
          <Grid item xs={4}>
            <Paper>
              <ButtonColumn>
                <Button onClick={onCreateUser} variant="contained">New Player</Button>
                <Button onClick={onCreateTeam} variant="contained">Register Team</Button>
                <Button onClick={onRegisterGame} variant="contained">Register Finished Game</Button>
                <Button href="/game" variant="contained">
                  Start Game!
                </Button>
              </ButtonColumn>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>Bottom information</Paper>
          </Grid>
        </Grid>
      </Box>
      {createUserOpen && <CreateUserModal open={createUserOpen} onClose={onCloseCreateUser}/>}
      {createTeamOpen && <CreateTeamModal open={createTeamOpen} onClose={onCloseCreateTeam}/>}
      {registerGameOpen && <RegisterGameModal open={registerGameOpen} onClose={onCloseRegisterGame}/>}
    </>
  )
}

function HallOfFame({users}) {
  const rows = users; 
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
    }
  ];
  
  return (
    <>
      <DataGrid
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
    </>
  )
}