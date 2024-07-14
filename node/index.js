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

app.listen(3000, () => console.log(`App running on port 3000.`));
  