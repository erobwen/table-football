import { Box, Button, CircularProgress, Grid, Paper } from "@mui/material";
import { useLoadedData } from '../../components/hooks';
import { getTeam, getTeamHistory } from "../../components/Client";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";

export function Team() {
  const { id } = useParams();
  const [history] = useLoadedData(() => getTeamHistory(id));
  const [team] = useLoadedData(() => getTeam(id));
  const navigate = useNavigate();

  const columns = [
    // {
    //   id: 'id',
    //   headerName: "Id",
    //   width: 50
    // },
    {
      field: 'opponentName',
      headerName: 'Opponent',
      width: 150
    },
    {
      field: 'win',
      headerName: 'Result',
      width: 150,
      renderCell: (params) => (
        <Box>{params.value ? "Win" : "Loss"}</Box>
      ),
    },
    {
      field: 'yourScore',
      headerName: 'Your Score',
      width: 150
    },
    {
      field: 'theirScore',
      headerName: 'Their Score',
      width: 150
    },
    {
      field: 'difference',
      headerName: 'Δ',
      width: 60
    }
  ];

  if (!team || !history) return <CircularProgress/>;

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper><h3 style={{height:"100px", lineHeight:"100px"}}>Team Page for {team.name}</h3></Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{padding: "10px", height: "400px"}}>
              <DataGrid sx={{".MuiCheckbox-root": { display: "none" }}}
                rows={history}
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
          </Grid>
          <Grid item xs={12}>
            <Paper style={{padding: "20px"}}>
              <Button onClick={() => navigate("/")} variant="contained">Back</Button>
            </Paper>
          </Grid>          
        </Grid>
      </Box>
    </>
  )
}
