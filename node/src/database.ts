import pg from 'pg';
const { Client } = pg;
import * as fs from 'fs';
import { Game, GameOfTeam, GameResult, Player, Team, TeamExtended } from './interfaces.js';
var schema = fs.readFileSync('schema.sql').toString();

export const client = new Client({
  user: 'postgres',
  // host: 'localhost', // when running outside docker for dev. 
  host: 'db',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

client.connect();

const createTables = async () => {  

  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id serial PRIMARY KEY
    );
  `);
  
  const response = await client.query(`SELECT * FROM migrations`);
  if (!response.rows.length) {

    // DB Schema
    await client.query(schema);

    // Mark done
    await client.query(`
      INSERT INTO migrations (id) 
        VALUES 
          (1);
    `);
  }
}

createTables();


/**
 * Setup demo
 */
export async function setupDemo(): Promise<undefined> {
    await clearDatabase();

    // Some dummy data for convenient development.  
    const [player1Id, team1Id] = await addPlayer("Player A");
    const [player2Id, team2Id] = await addPlayer("Player B");
    const [player3Id, team3Id] = await addPlayer("Player C");
    const [player4Id, team4Id] = await addPlayer("Player D");
    const team5Id = await addTeam(null, player2Id, player3Id);

    await addGame(true, team1Id, team2Id, 1, 0);
    await addGame(true, team1Id, team2Id, 3, 2);
    await addGame(true, team1Id, team2Id, 3, 5);
    await addGame(true, team1Id, team3Id, 3, 2);
    await addGame(true, team1Id, team3Id, 4, 2);
    await addGame(true, team1Id, team3Id, 4, 2);
    await addGame(true, team1Id, team5Id, 4, 2);
}


export async function clearDatabase() :Promise<undefined> {
  console.warn("Do not use in production! TODO: Block with ENV");
  client.query(`DELETE FROM games;`);
  client.query(`DELETE FROM teams;`);
  client.query(`DELETE FROM players;`);
}


/**
 * Players 
 */

export async function getAllPlayers(): Promise<Player[]> {
  const result = await client.query(`SELECT * FROM players;`);
  return (result).rows;
}

export async function getPlayer(id:number): Promise<Player>{
  return (await client.query(`SELECT * FROM players WHERE players.id=${id};`)).rows[0];
} 

export async function addPlayer(name:string) {
  try {
    await client.query('BEGIN')
    const response = await client.query(`INSERT INTO players(name) VALUES('${name}') RETURNING id;`);

    // Auto create a team as well for the player.
    const id = response.rows[0].id; 
    const teamKey = uniqueTeamKey(id, null);
    const teamId = (await client.query(`INSERT INTO teams("teamKey", name, "player1Id", "player2Id") VALUES('${teamKey}', '${name}', ${id}, NULL) RETURNING id;`)).rows[0].id;
    await client.query('COMMIT');
    return [id, teamId];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error; 
  } 
}


/**
 * Teams 
 */

export async function getAllTeams() : Promise<Team[]> {
  return (await client.query(`SELECT * FROM teams`)).rows;
}

export async function getAllTeamsSorted() : Promise<TeamExtended[]> {
  const teams = (await client.query(`SELECT * FROM teams`)).rows;
  for (let team of teams) {
    team.winRatio = team.playedGamesTotal > 0 ? team.wonGamesTotal / team.playedGamesTotal : "N/A";
    team.lostGamesTotal = team.playedGamesTotal - team.wonGamesTotal - team.drawGamesTotal;
    team.goalsDifference = team.goalsFor - team.goalsAgainst;
  }
  teams.sort((t1:TeamExtended, t2:TeamExtended) => {
    const t1w = t1.winRatio;
    const t2w = t2.winRatio;
    if (typeof(t1w) === "number" && typeof(t2w) === "number") {
      return t2w - t1w;
    } else if (t1w === "N/A" && t2w === "N/A") {
      return 0;
    } else if (t1w === "N/A") {
      return 1;
    } else {
      return -1;
    }
  });
  return teams;
}

export async function getTeam(id: number) {
  return (await client.query(`SELECT * FROM teams WHERE teams.id=${id};`)).rows[0];
} 

export async function getTeamGameHistory(id: number) : Promise<GameOfTeam[]> {
  return (changePerspective(id, (
    await client.query(`
      SELECT games.id, "team1Id", "team2Id", "team1Score", "team2Score", team1.name as "team1Name", team2.name as "team2Name" FROM games 
      JOIN teams as team1 ON games."team1Id"=team1.id
      JOIN teams as team2 ON games."team2Id"=team2.id
      WHERE (games."team1Id"=${id} OR games."team2Id"=${id}) AND finished=true;
    `)).rows
  ));  
}

// Note: not in use currently, taken care of on front end to avoid extra load. 
export async function getSharedGameHistory(id: number, otherId: number) : Promise<GameOfTeam[]> { 
  return (changePerspective(id, (await client.query(`
    SELECT games.id, "team1Id", "team2Id", "team1Score", "team2Score", team1.name as "team1Name", team2.name as "team2Name" FROM games 
    JOIN teams as team1 ON games."team1Id"=team1.id
    JOIN teams as team2 ON games."team2Id"=team2.id
    WHERE (games."team1Id"=${id} AND games."team2Id"=${otherId}) OR (games."team1Id"=${otherId} AND games."team2Id"=${id}) AND finished=true;
  `)).rows));
}

interface GamePlayedUnprocessed {
  id: number, 
  team1Id: number, 
  team2Id: number, 
  team1Score: number, 
  team2Score: number, 
  team1Name: string, 
  team2Name: string
}

const changePerspective = (id:number, gameHistory:GamePlayedUnprocessed[]) : GameOfTeam[] => {
  return gameHistory.map(
    (game) => {
      if (game.team1Id === id) {
        // team1Id perspective
        return ({
          id: game.id,
          result: game.team1Score === game.team2Score ? GameResult.Draw: (
            game.team1Score > game.team2Score ? GameResult.Win : GameResult.Loss
          ),
          opponentId: game.team2Id,
          opponentName: game.team2Name,
          yourScore: game.team1Score,
          theirScore: game.team2Score,
          difference: game.team1Score - game.team2Score
        })
      } else {
        // team12d perspective
        return ({
          id: game.id,
          result: game.team2Score === game.team1Score ? GameResult.Draw : (
            game.team2Score > game.team1Score ? GameResult.Win : GameResult.Loss
          ),
          win: game.team2Score > game.team1Score,
          draw: game.team1Score === game.team2Score,
          opponentId: game.team1Id,
          opponentName: game.team1Name,
          yourScore: game.team2Score,
          theirScore: game.team1Score,
          difference: game.team2Score - game.team1Score
        })
      }
    }
  );  
}


export function uniqueTeamKey(id1: number|null, id2: number|null) {
  // Note: Null/undefined is set to 0, this works since serial starts from 1'
  if (!id1) id1 = 0;
  if (!id2) id2 = 0;
  return id1 > id2 ? `${id1}.${id2}` : `${id2}.${id1}`; 
}

export async function addTeam(name: string|null, player1Id: number|null, player2Id: number|null): Promise<number> {
  const teamKey = uniqueTeamKey(player1Id, player2Id);

  if (!name) {
    const player1 = await getPlayer(player1Id as number);
    const player2 = await getPlayer(player2Id as number);
    name = `${player1.name} & ${player2.name}`
  }

  const result = await client.query(`INSERT INTO teams("teamKey", name, "player1Id", "player2Id") VALUES ('${teamKey}', '${name}', ${player1Id}, ${player2Id}) RETURNING id;`); 
  return result.rows[0].id;
}

export async function getPlayerIds(teamId: number) {
  const result = [];
  const team = await getTeam(teamId);
  if (team.player1Id) result.push(team.player1Id);
  if (team.player2Id) result.push(team.player2Id);
  return result;
}


/**
 * Games 
 */

export async function addGame(finished: boolean, team1Id: number, team2Id: number, team1Score: number|undefined, team2Score: number|undefined) {
  try {
    await client.query('BEGIN')

    // Update statistics
    if (finished) {
      await updateStatistics(team1Id, team2Id, team1Score as number, team2Score as number)
    }

    // Add game
    if (!team1Score) team1Score = 0;
    if (!team2Score) team2Score = 0;
    const response = await client.query(`INSERT INTO games(finished, "team1Id", "team2Id", "team1Score", "team2Score") VALUES(${finished}, ${team1Id}, ${team2Id}, ${team1Score}, ${team2Score}) RETURNING *;`);
    await client.query('COMMIT')
    return response.rows[0]; 
  } catch (error) {
    await client.query('ROLLBACK');
    throw error; 
  } 
}


/**
 * Ongoing game
 */

export async function getOngoingGame() {
  return (await client.query(`SELECT * FROM games WHERE games.finished=false;`)).rows[0];
}

export async function ongoingGameChanged(game: Game) {
  if (game.finished) {
    await finishOngoingGame(game);
  } else {
    await updateOngoingGame(game); 
  }
}

export async function updateOngoingGame(game: Game) {
  const existing = await getOngoingGame();
  if (existing.finished) throw new Error("Cannot update finished game!");
  if (existing.id !== game.id) throw new Error("Wrong id at game update?");

  await client.query(`UPDATE games SET "team1Score" = ${game.team1Score}, "team2Score" = ${game.team2Score} WHERE id = ${game.id};`);
}

export async function finishOngoingGame(game: Game) {
  const existing = await getOngoingGame();
  if (existing.id !== game.id) throw new Error("Wrong id at game update?");

  try {
    await client.query('BEGIN')
    await client.query(`UPDATE games SET finished = true WHERE id = ${game.id};`);
    updateStatistics(game.team1Id, game.team2Id, game.team1Score as number, game.team2Score as number);
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK');
    throw error; 
  } 
}


/**
 * Statistics 
 */

export async function updateStatistics(team1Id: number, team2Id: number, team1Score: number, team2Score: number) {
  if (team1Score > team2Score) {
    await incrementPlayedStatistics(true, false, team1Id, team1Score, team2Score);
    await incrementPlayedStatistics(false, false, team2Id, team2Score, team1Score);
  } else if (team1Score < team2Score) {
    await incrementPlayedStatistics(true, false, team2Id, team2Score, team1Score);
    await incrementPlayedStatistics(false, false, team1Id, team1Score, team2Score);
  } else {
    await incrementPlayedStatistics(false, true, team2Id, team2Score, team1Score);
    await incrementPlayedStatistics(false, true, team1Id, team1Score, team2Score);
  }
}

export async function incrementPlayedStatistics(winner: boolean, draw: boolean, teamId: number, goalsFor: number, goalsAgainst: number) {
  await client.query(`
    UPDATE teams SET 
      "wonGamesTotal" = "wonGamesTotal" + ${winner ? 1 : 0}, 
      "drawGamesTotal" = "drawGamesTotal" + ${draw ? 1 : 0}, 
      "playedGamesTotal" = "playedGamesTotal" + 1, 
      "goalsFor" = "goalsFor" + ${goalsFor},   
      "goalsAgainst" = "goalsAgainst" + ${goalsAgainst}  
      WHERE id = ${teamId};`);
}