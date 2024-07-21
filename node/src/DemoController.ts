import { addGame, addTeam, addPlayer, getAllTeams, getAllPlayers, getOngoingGame, getTeam, getPlayerIds, getTeamGameHistory, getAllTeamsSorted, ongoingGameChanged, setupDemo } from './database.js'; 
import { Body, Controller, Get, Path, Post, Route, SuccessResponse, Response, Put } from "tsoa";
import { GameOfTeam, Player, Game, Team, TeamExtended } from './interfaces.js';


/**
 * Players controller
 */

@Route("demo")
export class DemoController extends Controller {
  @Post()
  public async setupDemo(): Promise<string> {
    try {
      await setupDemo();
      this.setStatus(200);
      return "Demo setup complete.";
    } catch (error: any) {
      this.setStatus(500);
      return error.message; 
    }  
  }
}