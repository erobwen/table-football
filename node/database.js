import pg from 'pg';
const { Client } = pg;
import * as fs from 'fs';
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

    // Some dummy data for convenient development.  
    await addPlayer("Player A");
    await addPlayer("Player B");
    await addPlayer("Player C");

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
 * Players 
 */

export async function getAllPlayers() {
  const result = await client.query(`SELECT * FROM players;`);
  return (result).rows;
}

export async function getPlayer(id) {
  return (await client.query(`SELECT * FROM players WHERE players.id=${id};`)).rows[0];
} 

export async function addPlayer(name) {
  try {
    await client.query('BEGIN')
    const response = await client.query(`INSERT INTO players(name) VALUES('${name}') RETURNING id;`);

    // Auto create a team as well for the player.
    const id = response.rows[0].id; 
    const teamKey = uniqueTeamKey(id, null);
    await client.query(`INSERT INTO teams("teamKey", name, "player1Id", "player2Id") VALUES('${teamKey}', '${name}', ${id}, NULL);`);
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK');
    throw error; 
  } 
}


/**
 * Teams 
 */

export async function getAllTeams() {
  return (await client.query(`SELECT * FROM teams`)).rows;
}

export async function getTeam(id) {
  return (await client.query(`SELECT * FROM teams WHERE teams.id=${id};`)).rows[0];
} 

export async function getTeamGameHistory(id) {
  return (changePerspective(id, (
    await client.query(`
      SELECT games.id, "team1Id", "team2Id", "team1Score", "team2Score", team1.name as "team1Name", team2.name as "team2Name" FROM games 
      JOIN teams as team1 ON games."team1Id"=team1.id
      JOIN teams as team2 ON games."team2Id"=team2.id
      WHERE (games."team1Id"=${id} OR games."team2Id"=${id}) AND finished=true;
    `)).rows
  ));  
}

const changePerspective = (id, gameHistory) => {
  return gameHistory.map(
    (game) => {
      if (game.team1Id === id) {
        return ({
          id: game.id,
          win: game.team1Score > game.team2Score,  
          opponentId: game.team2Id,
          opponentName: game.team2Name,
          yourScore: game.team1Score,
          theirScore: game.team2Score,
          difference: game.team1Score - game.team2Score
        })
      } else {
        return ({
          id: game.id,
          win: game.team2Score > game.team1Score,
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

export async function getSharedGameHistory(team1Id, team2Id) {
  return (await client.query(`
    SELECT games.id, "team1Id", "team2Id", "team1Score", "team2Score", team1.name as "team1Name", team2.name as "team2Name" FROM games 
    JOIN teams as team1 ON games."team1Id"=team1.id
    JOIN teams as team2 ON games."team2Id"=team2.id
    WHERE (games."team1Id"=1 AND games."team2Id"=2) OR (games."team1Id"=2 AND games."team2Id"=1) AND finished=true;
  `)).rows;
}

export function uniqueTeamKey(id1, id2) {
  // Note: Null/undefined is set to 0, this works since serial starts from 1'
  if (!id1) id1 = 0;
  if (!id2) id2 = 0;
  return id1 > id2 ? `${id1}.${id2}` : `${id2}.${id1}`; 
}

export async function addTeam(name, player1Id, player2Id) {
  const teamKey = uniqueTeamKey(player1Id, player2Id);

  if (!name) {
    const player1 = await getPlayer(player1Id);
    const player2 = await getPlayer(player2Id);
    name = `${player1.name} & ${player2.name}`
  }

  await client.query(`INSERT INTO teams("teamKey", name, "player1Id", "player2Id") VALUES ('${teamKey}', '${name}', ${player1Id}, ${player2Id});`); 
  return teamKey;
}

export async function getPlayerIds(teamId) {
  const result = [];
  const team = await getTeam(teamId);
  if (team.player1Id) result.push(team.player1Id);
  if (team.player2Id) result.push(team.player2Id);
  return result;
}


/**
 * Games 
 */

export async function addGame(finished, team1Id, team2Id, team1Score, team2Score) {
  try {
    await client.query('BEGIN')

    // Update statistics
    if (finished) {
      await updateStatistics(team1Id, team2Id, team1Score, team2Score)
    }

    // Add game
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

export async function updateOngoingGame(game) {
  const existing = await getOngoingGame();
  if (existing.finished) throw new Error("Cannot update finished game!");
  if (existing.id !== game.id) throw new Error("Wrong id at game update?");

  const response = await client.query(`UPDATE games SET "team1Score" = ${game.team1Score}, "team2Score" = ${game.team2Score} WHERE id = ${game.id};`);
  return response.data;
}

export async function finishOngoingGame(game) {
  const existing = await getOngoingGame();
  if (existing.id !== game.id) throw new Error("Wrong id at game update?");

  try {
    await client.query('BEGIN')
    await client.query(`UPDATE games SET finished = true WHERE id = ${game.id};`);
    updateStatistics(game.team1Id, game.team2Id, game.team1Score, game.team2Score);
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK');
    throw error; 
  } 
}


/**
 * Statistics 
 */

export async function updateStatistics(team1Id, team2Id, team1Score, team2Score) {
  if (team1Score > team2Score) {
    await incrementPlayedStatistics(true, team1Id, team1Score, team2Score);
    await incrementPlayedStatistics(false, team2Id, team2Score, team1Score);
  } else if (team1Score < team2Score) {
    await incrementPlayedStatistics(true, team2Id, team2Score, team1Score);
    await incrementPlayedStatistics(false, team1Id, team1Score, team2Score);
  } else {
    await incrementPlayedStatistics(false, team2Id, team2Score, team1Score);
    await incrementPlayedStatistics(false, team1Id, team1Score, team2Score);
  }
}

export async function incrementPlayedStatistics(winner, teamId, goalsFor, goalsAgainst) {
  await client.query(`
    UPDATE teams SET 
      "wonGamesTotal" = "wonGamesTotal" + ${winner ? 1 : 0}, 
      "playedGamesTotal" = "playedGamesTotal" + 1, 
      "goalsFor" = "goalsFor" + ${goalsFor},   
      "goalsAgainst" = "goalsAgainst" + ${goalsAgainst}  
      WHERE id = ${teamId};`);
}