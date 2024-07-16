import pg from 'pg';
const { Client } = pg;
import * as fs from 'fs';
var schema = fs.readFileSync('schema.sql').toString();

export const client = new Client({
  user: 'postgres',
  host: 'localhost', // when running outside docker for dev. 
  // host: 'db',
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

// TODO: Constraint syntax
// CONSTRAINT fk_blue_team
// FOREIGN KEY(blue_team) 
//   REFERENCES teams(id)
//     ON DELETE SET NULL

  