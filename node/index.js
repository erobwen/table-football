import { client } from './database.js'; 

import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow CORS:
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  next()
})

console.log("here")

app.get('/api', (req, res) => res.send('Hello World!'));
app.get('/api/users', async (req, res) => {
  try {
    const response = await client.query(`SELECT * FROM users`);
    
    if(response){
      res.status(200).send(response.rows);
    }
    
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  } 
});

app.listen(3000, () => console.log(`App running on port 3000.`));
  
