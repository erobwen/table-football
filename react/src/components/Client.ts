import axios from "axios";

let base = "http://localhost:3000"

export async function getPlayers() {
  try {
    return (await axios.get(base + "/api/players")).data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function postPlayer(name: string) {
  try {
    const result = await axios.post(base + "/api/players", {name}); 
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function getTeams() {
  try {
    return (await axios.get(base + "/api/teams")).data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function getTeamsSorted() {
  try {
    return (await axios.get(base + "/api/teams/sorted")).data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function getTeam(id:number) {
  try {
    return (await axios.get(base + `/api/teams/${id}`)).data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function getTeamHistory(id:number) {
  try {
    return (await axios.get(base + `/api/teams/${id}/history`)).data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function postTeam(name:string, player1Id:number, player2Id:number) {
  try {
    const result = await axios.post(base + "/api/teams", {name, player1Id, player2Id}); 
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function postFinishedGame(team1Id:number, team2Id:number, team1Score:number, team2Score:number) {
  try {
    const result = await axios.post(base + "/api/games", {finished: true, team1Id, team2Id, team1Score, team2Score}); 
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function postStartedGame(team1Id:number, team2Id:number) {
  try {
    const result = await axios.post(base + "/api/games", {finished: false, team1Id, team2Id}); 
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function getOngoingGame() {
  try {
    const result = await axios.get(base + "/api/ongoing-game");
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

interface GameInterface {
  id: number,
  finished: boolean,
  team1Id: number, 
  team2Id: number, 
  team1Score: number, 
  team2Score: number 
}

export async function updateOngoingGame(game: GameInterface) {
  try {
    const result = await axios.put(base + "/api/ongoing-game", game);
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function finishOngoingGame(game: GameInterface) {
  try {
    const result = await axios.put(base + "/api/ongoing-game", game);
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}
