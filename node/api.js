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
  apis: ["api.js"]
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
 * @swagger
 * /api/players:
 *    get:
 *      description: List all players
 *    responses:
 *      '200':
 *        description: All players
 *      '500':
 *        description: Server error
 */
app.get('/api/players', async (req, res) => {
  try {
    res.status(200).send(await getAllPlayers());
  } catch (error) {
    res.status(500).send(error);
  } 
});


/**
 * @swagger
 * /api/players:
 *    post:
 *      description: Add player
 *    responses:
 *      '200':
 *        description: Player added
 *      '400':
 *        description: Player already exists
 */
app.post('/api/players', async (req, res) => {
  try {
    await addPlayer(req.body.name);
    res.status(200).send("Successfully added player.");
  } catch (error) {
    res.status(400).send("Could not add player, player already exists!");
  } 
});


/**
 * @swagger
 * /api/teams:
 *    post:
 *      description: List all teams.
 *    responses:
 *      '200':
 *        description: List all teams.
 *      '500':
 *        description: Server error.
 */
app.get('/api/teams', async (req, res) => {
  try {
    res.status(200).send(await getAllTeams());
  } catch (error) {
    res.status(500).send(error);
  } 
});


/**
 * @swagger
 * /api/teams:
 *    post:
 *      description: List all teams, augmented with information and sorted.
 *    responses:
 *      '200':
 *        description: List all teams
 *      '500':
 *        description: Server errlr
 */
app.get('/api/teams/sorted', async (req, res) => {
  try {
    const teams = await getAllTeams();
    for (let team of teams) {
      team.winRatio = team.playedGamesTotal > 0 ? (team.wonGamesTotal + 0.0) / team.playedGamesTotal : "N/A";
      team.lostGamesTotal = team.playedGamesTotal - team.wonGamesTotal;
      team.goalsDifference = team.goalsFor - team.goalsAgainst;
    }
    teams.sort((t1, t2) => {
      t1 = t1.winRatio;
      t2 = t2.winRatio;
      if (typeof(t1) === "number" && typeof(t2) === "number") {
        return t2 - t1;
      } else if (t1 === "N/A" && t2 === "N/A") {
        return 0;
      } else if (t1 === "N/A") {
        return 1;
      } else {
        return -1;
      }
    });
    res.status(200).send(teams);
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
  