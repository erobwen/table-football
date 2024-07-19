import { Box, Button, CircularProgress, Grid, Paper } from "@mui/material";
import { useLoadedData } from '../../components/hooks';
import { getTeam, getTeamHistory } from "../../components/Client";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

export function Team() {
  const { id } = useParams();
  const [history] = useLoadedData(() => getTeamHistory(id), null, [id]);
  const [team] = useLoadedData(() => getTeam(id), null, [id]);
  const navigate = useNavigate();

  // Selected team to compare with
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeamName, setSelectedTeamName] = useState("");

  // Data shown
  const [shownHistory, setShownHistory] = useState([])
  const [shownSummary, setShownSummary] = useState({});
  useEffect(() => {
    if (!team || !history) return; 
    if (!selectedTeamId) {

      // Just display normal
      setShownHistory(history);
      team.lostGamesTotal = team.playedGamesTotal - team.wonGamesTotal - team.drawGamesTotal;// - team.drawGamesTotal;
      team.winRatio = team.wonGamesTotal / team.playedGamesTotal;
      setShownSummary(team);

    } else {

      // Display comparison data
      setShownHistory(history.filter(record => (record.opponentId === selectedTeamId)));
      const summary = history.reduce((result, current) => {
        if (current.opponentId === selectedTeamId) {
          result.playedGamesTotal++;     
          if (current.win) result.wonGamesTotal++;
          if (current.draw) result.drawGamesTotal++;
          result.goalsAgainst += current.theirScore; 
          result.goalsFor += current.yourScore; 
        }
        return result; 
      }, {
        wonGamesTotal: 0,
        drawGamesTotal: 0,
        playedGamesTotal: 0,
        goalsAgainst: 0,
        goalsFor: 0
      });
      summary.lostGamesTotal = summary.playedGamesTotal - summary.wonGamesTotal - summary.drawGamesTotal;
      summary.winRatio = summary.wonGamesTotal / summary.playedGamesTotal;
      setShownSummary(summary)
    }
  }, [team, history, selectedTeamId])

  const columns = [
    {
      field: 'opponentName',
      headerName: 'Opponent',
      width: 150,
      renderCell: !selectedTeamId && ((params) => (
          <Button style={{textTransform: "none"}} variant="text" onClick={
            ()=> { 
              setSelectedTeamId(params.row.opponentId); 
              setSelectedTeamName(params.row.opponentName);
            }
          }>
            {params.value}
          </Button>
        ))
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

  if (!team || !shownHistory || !shownSummary) return <CircularProgress/>;

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <h3 style={{height:"100px", lineHeight:"100px"}}>Matches of {team.name}
                {selectedTeamName && <span>&nbsp;vs&nbsp;</span>}
                {selectedTeamName && 
                  <Button style={{textTransform: "none"}} onClick={() => {setSelectedTeamId(null); setSelectedTeamName(null)}}>
                    <h3>{selectedTeamName}</h3> 
                    <CloseIcon style={{marginLeft: "5px"}}/>
                  </Button>}
              </h3>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <Box style={{padding: "20px", gap: "20px", display: "flex", flexDirection: "row"}}>
                <Box>Played: {shownSummary.playedGamesTotal}</Box>
                <Box>Wins: {shownSummary.wonGamesTotal}</Box>
                <Box>Draws: {shownSummary.drawGamesTotal}</Box>
                <Box>Losses: {shownSummary.lostGamesTotal}</Box>
                <Box>Goals For: {shownSummary.goalsFor}</Box>
                <Box>Goals Against: {shownSummary.goalsAgainst}</Box>
                <Box>Win Ratio: {shownSummary.winRatio}</Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{padding: "10px", height: "400px"}}>
              <DataGrid sx={{".MuiCheckbox-root": { display: "none" }}}
                rows={shownHistory}
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
