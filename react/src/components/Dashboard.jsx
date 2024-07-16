import { Box, Grid, Paper } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useLoadedData } from './hooks';

export function Dashboard() {
  const [users, reload] = useLoadedData("/api/users", 
    [
      {
        id: 1,
        name: "Foo",
      },
      {
        id: 2,
        name: "Bar"
      }
    ]
  );

  return (
    <>
      <HallOfFame users={users}/>
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
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper><h2 style={{height:"100px", lineHeight:"100px"}}>Table Football Hall of Fame</h2></Paper>
          </Grid>
          <Grid item xs={8} style={{height:"300px"}}>
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
          </Grid>
          <Grid item xs={4}>
            <Paper>Side information</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>Bottom information</Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}