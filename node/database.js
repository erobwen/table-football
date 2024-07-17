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
    await addUser("User1");
    await addUser("User2");
    await addUser("User3");

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
 * Users 
 */

export async function getAllUsers() {
  const result = await client.query(`SELECT * FROM users;`);
  return (result).rows;
}

export async function getUser(id) {
  return (await client.query(`SELECT * FROM users WHERE users.id=${id};`)).rows[0];
} 

export async function addUser(name) {
  try {
    await client.query('BEGIN')
    const response = await client.query(`INSERT INTO users(name) VALUES('${name}') RETURNING id;`);

    // Auto create a team as well for the player.
    const id = response.rows[0].id; 
    const teamKey = uniqueTeamKey(id, null);
    await client.query(`INSERT INTO teams(team_key, name, player1_id, player2_id) VALUES('${teamKey}', '${name}', ${id}, NULL);`);
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

export function uniqueTeamKey(id1, id2) {
  // Note: Null/undefined is set to 0, this works since serial starts from 1'
  if (!id1) id1 = 0;
  if (!id2) id2 = 0;
  return id1 > id2 ? `${id1}.${id2}` : `${id2}.${id1}`; 
}

export async function addTeam(name, player1Id, player2Id) {
  const teamKey = uniqueTeamKey(player1Id, player2Id);

  if (!name) {
    const player1 = await getUser(player1Id);
    const player2 = await getUser(player2Id);
    name = `${player1.name} & ${player2.name}`
  }

  await client.query(`INSERT INTO teams(team_key, name, player1_id, player2_id) VALUES ('${teamKey}', '${name}', ${player1Id}, ${player2Id});`); 
  return teamKey;
}

export async function getPlayerIds(teamId) {
  const team = await getTeam(teamId);
  return [team.player1_id, team.player2_id];
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
    const response = await client.query(`INSERT INTO games(finished, team1, team2, team1_score, team2_score) VALUES(${finished}, ${team1Id}, ${team2Id}, ${team1Score}, ${team2Score}) RETURNING *;`);
    await client.query('COMMIT')
    return response.rows[0]; 
  } catch (error) {
    await client.query('ROLLBACK');
    throw error; 
  } 
}


/**
 * Statistics 
 */

export async function incrementPlayedStatistics(teamId) {
  const [player1Id, player2Id] = await getPlayerIds(teamId);
  await client.query(`UPDATE users SET played_games_total = played_games_total + 1 WHERE users.id=${player1Id};`)
  if (player2Id) {
    await client.query(`UPDATE users SET played_games_total = played_games_total + 1 WHERE users.id=${player2Id};`)
  } else {
    await client.query(`UPDATE users SET played_games_single = played_games_single + 1 WHERE users.id=${player1Id};`)
  }
}

export async function incrementWinStatistics(teamId) {
  const [player1Id, player2Id] = await getPlayerIds(teamId);
  await client.query(`UPDATE users SET won_games_total = won_games_total + 1 WHERE users.id=${player1Id};`)
  if (player2Id) {
    await client.query(`UPDATE users SET won_games_total = won_games_total + 1 WHERE users.id=${player2Id};`)
  } else {
    await client.query(`UPDATE users SET won_games_single = won_games_single + 1 WHERE users.id=${player1Id};`)
  }
}

export async function updateStatistics(team1Id, team2Id, team1Score, team2Score) {
  await incrementPlayedStatistics(team1Id);
  await incrementPlayedStatistics(team2Id);
  if (team1Score > team2Score) {
    await incrementWinStatistics(team1Id);
  } else if (team1Score > team2Score) {
    await incrementWinStatistics(team2Id);
  }
}
