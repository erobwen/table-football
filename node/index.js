import { addTeam, addUser, getAllTeams, getAllUsers } from './database.js'; 

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


/**
 * Users
 */

app.get('/api/users', async (req, res) => {
  console.log("get Users");
  try {
    res.status(200).send(await getAllUsers());
  } catch (error) {
    res.status(500).send(error);
  } 
});

app.post('/api/users', async (req, res) => {
  try {
    addUser(req.body.name);
    res.status(200).send("Successfully added user.");
  } catch (error) {
    res.status(500).send("Could not add player, player already exists!");
  } 
});


/**
 * Teams
 */

app.get('/api/teams', async (req, res) => {
  try {
    res.status(200).send(await getAllTeams());
  } catch (error) {
    res.status(500).send(error);
  } 
});

app.post('/api/teams', async (req, res) => {
  let {name, player1Id, player2Id} = req.body;
  if (player1Id === player2Id) {
    res.status(500).send("Players needs to be different in a team.");
  }

  try {
    await addTeam(name, player1Id, player2Id); 
    res.status(200).send("Successfully created team!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not add team. A team with the same people already exists!");
  }
});

app.listen(3000, () => console.log(`App running on port 3000.`));
  
