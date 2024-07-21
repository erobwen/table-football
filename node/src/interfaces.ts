
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

export enum GameResult {
  Win = "win",
  Draw = "draw",
  Loss = "loss"
}

export interface GameOfTeam {
  id: number,
  result: GameResult,
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