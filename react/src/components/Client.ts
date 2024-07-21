import axios from "axios";

const base = "http://localhost:3000"

export interface Player {
  id: number, 
  name: string
}

export interface Team {
  id: number,
  teamKey: string,
  name: string,
  player1Id: number, 
  player2Id: number,
  wonGamesTotal: number,
  drawGamesTotal: number,
  playedGamesTotal: number,
  goalsAgainst: number,
  goalsFor: number
}

export interface TeamExtended extends Team {
  winRatio: number|string, // String "N/A" when no matches played.
  lostGamesTotal: number,
  goalsDifference: number
}

export enum MatchResult {
  Win = "win",
  Draw = "draw",
  Loss = "loss"
}

export interface MatchPlayed {
  id: number,
  result: MatchResult,
  opponentId: number,
  opponentName: string,
  yourScore: number,
  theirScore: number,
  difference: number
}

export interface Game {
  id?: number,
  finished: boolean,
  team1Id: number, 
  team2Id: number, 
  team1Score?: number, 
  team2Score?: number 
}

export async function getPlayers(): Promise<Player[]> {
  try {
    return (await axios.get(base + "/api/players")).data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function postPlayer(name: string) : Promise<string>{
  try {
    const result = await axios.post(base + "/api/players", {name}); 
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function getTeams(): Promise<Team[]> {
  try {
    return (await axios.get(base + "/api/teams")).data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function getTeamsSorted() : Promise<TeamExtended[]>{
  try {
    return (await axios.get(base + "/api/teams/sorted")).data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function getTeam(id:number) : Promise<Team> {
  try {
    return (await axios.get(base + `/api/teams/${id}`)).data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function getTeamHistory(id:number) : Promise<MatchPlayed[]>{
  try {
    return (await axios.get(base + `/api/teams/${id}/history`)).data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function postTeam(name:string, player1Id:number, player2Id:number) : Promise<string> {
  try {
    const result = await axios.post(base + "/api/teams", {name, player1Id, player2Id}); 
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function postFinishedGame(team1Id:number, team2Id:number, team1Score:number, team2Score:number) : Promise<string> {
  try {
    const result = await axios.post(base + "/api/games", {finished: true, team1Id, team2Id, team1Score, team2Score}); 
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function postStartedGame(team1Id:number, team2Id:number) : Promise<string> {
  try {
    const result = await axios.post(base + "/api/games", {finished: false, team1Id, team2Id}); 
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function getOngoingGame() : Promise<Game> {
  try {
    const result = await axios.get(base + "/api/ongoing-game");
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}

export async function updateOngoingGame(game: Game) : Promise<string> {
  try {
    const result = await axios.put(base + "/api/ongoing-game", game);
    return result.data; 
  } catch(error:any) {
    throw new Error(error.response.data);
  }
}
