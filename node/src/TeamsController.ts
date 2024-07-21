import { addGame, addTeam, addPlayer, getAllTeams, getAllPlayers, getOngoingGame, getTeam, getPlayerIds, getTeamGameHistory, getAllTeamsSorted, ongoingGameChanged } from './database.js'; 
import { Body, Controller, Get, Path, Post, Route, SuccessResponse, Response, Put } from "tsoa";
import { GameOfTeam, Player, Game, Team, TeamExtended } from './interfaces.js';


/**
 * Teams controller
 */

@Route("teams")
export class TeamsController extends Controller {
  @Get()
  public async getTeams(): Promise<Team[]> {
    const result = await getAllTeams();
    this.setStatus(200);
    return result; 
  }

  @Get("/sorted")
  public async getTeamsSorted(): Promise<TeamExtended[]> {
    const result = await getAllTeamsSorted();
    this.setStatus(200);
    return result; 
  }

  @Get("{id}")
  public async getTeam(@Path() id:string): Promise<Team[]> {
    const result = await getTeam(parseInt(id));
    this.setStatus(200);
    return result; 
  }

  @Get("{id}/history")
  public async getTeamHistory(@Path() id:string): Promise<GameOfTeam[]> {
    const result = await getTeamGameHistory(parseInt(id));
    this.setStatus(200);
    return result; 
  }

  @Response("400", "Players needs to be different in a team.")
  @Response("400", "Could not add team. A team with the same people already exists!")
  @SuccessResponse("200", "Successfully created team!")
  @Post()
  public async postTeam(@Body() request: {name:any, player1Id:any, player2Id:any}): Promise<string> {
    let {name, player1Id, player2Id}: {name:any, player1Id: any, player2Id: any} = request;
    if (player1Id === "") player1Id = null;
    if (player2Id === "") player2Id = null;
    if (player1Id === player2Id) {
      this.setStatus(400);
      return "Cannot add the same player twice in the same team."; 
    }
  
    try {
      await addTeam(name, player1Id, player2Id); 
      this.setStatus(200);
      return "Successfully created team!";
    } catch (error) {
      console.log(error);
      this.setStatus(400);
      return "Could not add team. A team with the same people already exists!";
    }
  }
}

