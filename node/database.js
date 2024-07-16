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
    await client.query(`
      INSERT INTO users (name) 
      VALUES 
        ('User1'),
        ('User2'),
        ('User3');
    `);

    // Mark done
    await client.query(`
      INSERT INTO migrations (id) 
        VALUES 
          (1);
    `);
  }
}

createTables();


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

export async function getAllTeams() {
  return await client.query(`SELECT * FROM teams`).rows;
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
    const player1 = getUser(player1Id);
    const player2 = getUser(player2Id);
    name = `Team ${player1.name} and ${player1.name}`
  }

  await client.query(`INSERT INTO teams(team_key, name, player1_id, player2_id) VALUES ('${teamKey}', '${name}', ${player1Id}, ${player2Id});`); 
  return teamKey;
}