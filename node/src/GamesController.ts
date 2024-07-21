import { addGame, addTeam, addPlayer, getAllTeams, getAllPlayers, getOngoingGame, getTeam, getPlayerIds, getTeamGameHistory, getAllTeamsSorted, ongoingGameChanged } from './database.js'; 
import { Body, Controller, Get, Path, Post, Route, SuccessResponse, Response, Put } from "tsoa";
import { Game } from './interfaces.js';


/**
 * Games controller
 */

@Route("games")
export class GamesController extends Controller {
  @Response("400", "A team cannot play against itself!")
  @Response("400", "A player cannot play on both sides!")
  @Response("400", "Negative score not possible!")
  @SuccessResponse("200", "Successfully registered game!")
  @Post()
  public async postGame(@Body() request: Game): Promise<string> {
    let {finished, team1Id, team2Id, team1Score, team2Score} = request;
    if (team1Id === team2Id) {
      this.setStatus(400);
      return "A team cannot play against itself!";
    }
    const team1Players = await getPlayerIds(team1Id);
    const team2Players = await getPlayerIds(team2Id);
    for (let player of team1Players) {
      if (team2Players.includes(player)) {
        this.setStatus(400);
        return "A player cannot play on both sides!";
      }
    }
  
    if (team1Score < 0 || team2Score < 0) {
      this.setStatus(400);
      return "Negative score not possible!";
    }
  
    try {
      await addGame(finished, team1Id, team2Id, team1Score, team2Score);
      this.setStatus(200);
      return "Successfully registered game!";
    } catch (error:any) {
      console.log(error);
      return error.message;
    }
  }  
}

