import { addGame, addTeam, addPlayer, getAllTeams, getAllPlayers, getOngoingGame, getTeam, getPlayerIds, getTeamGameHistory, getAllTeamsSorted, ongoingGameChanged } from './database.js'; 
import { Body, Controller, Get, Path, Post, Route, SuccessResponse, Response, Put } from "tsoa";
import { GameOfTeam, Player, Game, Team, TeamExtended } from './interfaces.js';


/**
 * Players controller
 */

@Route("players")
export class PlayersController extends Controller {
  @Get()
  public async getPlayers(): Promise<Player[]> {
    return await getAllPlayers();
  }

  @Response("400", "Could not add player, player already exists!")
  @SuccessResponse("200", "Successfully added player.") // Custom success response
  @Post()
  public async postPlayer(@Body() request: {name: string}): Promise<string> {
    try {
      await addPlayer(request.name);
      this.setStatus(200);
      return "Successfully added player.";
    } catch (error) {
      this.setStatus(400);
      return "Could not add player, player already exists!"
    }  
  }
}