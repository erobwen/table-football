import pg from 'pg';
const { Client } = pg;

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

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY, 
      name VARCHAR (255) UNIQUE NOT NULL
    );
  `);

  // Some dummy data for convenient development.
  const response = await client.query(`SELECT * FROM migrations`);
  if (!response.rows.length) {
    await client.query(`
      INSERT INTO migrations (id) 
      VALUES 
        (1);
    `)
  
    await client.query(`
      INSERT INTO users (name) 
      VALUES 
        ('User1'),
        ('User2'),
        ('User3');
    `);
  }
}

      
  
createTables();