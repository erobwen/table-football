import { addGame, addTeam, addPlayer, finishOngoingGame, getAllTeams, getAllPlayers, getOngoingGame, getTeam, updateOngoingGame } from './database.js'; 

import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Table Football",
      description: "Statistics",
      contact: {
        name: "Robert Renbris"
      },
      servers: ["http://localhost:3000"]
    }
  },
  // ['.routes/*.js']
  apis: ["index.js"]
};


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

// Swagger auto-generate
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));



/**
 * Players
 */

/**
 * @swagger
 * /players:
 *    get:
 *      description: Use to return all customers
 *    responses:
 *      '200':
 *        description: All players
 */
app.get('/api/players', async (req, res) => {
  try {
    res.status(200).send(await getAllPlayers());
  } catch (error) {
    res.status(500).send(error);
  } 
});

app.post('/api/players', async (req, res) => {
  try {
    addPlayer(req.body.name);
    res.status(200).send("Successfully added player.");
  } catch (error) {
    res.status(400).send("Could not add player, player already exists!");
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

app.get('/api/teams/:id', async (req, res) => {
  try {
    res.status(200).send(await getTeam(req.params.id));
  } catch (error) {
    res.status(500).send(error);
  } 
});

app.post('/api/teams', async (req, res) => {
  let {name, player1Id, player2Id} = req.body;
  if (player1Id === "") player1Id = null;
  if (player2Id === "") player2Id = null;
  if (player1Id === player2Id) {
    return res.status(400).send("Players needs to be different in a team.");
  }

  try {
    await addTeam(name, player1Id, player2Id); 
    res.status(200).send("Successfully created team!");
  } catch (error) {
    console.log(error);
    res.status(400).send("Could not add team. A team with the same people already exists!");
  }
});


/**
 * Games
 */

app.post('/api/games', async (req, res) => {
  let {finished, team1Id, team2Id, team1Score=0, team2Score=0} = req.body;
  if (team1Id === team2Id) {
    return res.status(400).send("A team cannot play against itself!");
  }
  if (team1Score < 0 || team2Score < 0) {
    return res.status(400).send("Negative score not possible!");
  }

  try {
    await addGame(finished, team1Id, team2Id, team1Score, team2Score); 
    res.status(200).send("Successfully registered game!");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});


/**
 * Ongoing game
 */

app.get('/api/ongoing-game', async (req, res) => {
  try {
    const game = await getOngoingGame(); 
    res.status(200).send(game);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});


// Note: Use this endpoint to finish as well, by sending game.finished = true;
app.put('/api/ongoing-game', async (req, res) => {
  let game = req.body;
  try {
    if (game.finished) {
      await finishOngoingGame(game);
    } else {
      await updateOngoingGame(game); 
    }
    res.status(200).send("Updated game status!");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});



/**
 * Start server
 */

app.listen(3000, () => console.log(`App running on port 3000.`));
  