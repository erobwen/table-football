import { client } from './database.js'; 

import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow CORS:
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.setHeader(`Access-Control-Allow-Headers`, `Content-Type`);
  next()
})

app.get('/api', (req, res) => res.send('Hello World!'));
app.get('/api/users', async (req, res) => {
  try {
    const response = await client.query(`SELECT * FROM users`);
    
    if(response){
      res.status(200).send(response.rows);
    }
    
  } catch (error) {
    res.status(500).send(error);
  } 
});

app.post('/api/users', async (req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // console.log(req)
  try {
    const response = await client.query(`INSERT INTO users(name) VALUES ('${req.body.name}');`);

    if(response){
      res.status(200).send("Successfully added user.");
    }
    
  } catch (error) {
    res.status(500).send("Could not add player, player already exists!");
  } 
});


app.listen(3000, () => console.log(`App running on port 3000.`));
  
