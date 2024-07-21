import { getOngoingGame, ongoingGameChanged } from './database.js'; 
import { Body, Controller, Get, Path, Post, Route, SuccessResponse, Response, Put } from "tsoa";
import { Game } from './interfaces.js';


/**
 * Games controller
 */

@Route("ongoing-game")
export class OngoingGameController extends Controller {
  
  @Get()
  public async get(): Promise<Game> {
    const result = await getOngoingGame();
    this.setStatus(200);
    return result; 
  }

  @Put()
  public async put(@Body() game: Game): Promise<string>  {
    try {
      ongoingGameChanged(game);
      this.setStatus(200);
      return "Updated game status!";
    } catch (error:any) {
      console.log(error);
      this.setStatus(500);
      return error.message;
    }
  }
}