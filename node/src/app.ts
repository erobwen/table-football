import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from "./routes.js";
import openApi from './swagger.json' with { type: "json"};

(async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // allow CORS:
  app.use(function (req, res, next) {
    const origin = req.get('origin');
    if (origin === "http://localhost:5173") {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Dev
    } else if (origin === "http://localhost:4173") {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4173'); // Compiled
    }
    res.setHeader(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.setHeader(`Access-Control-Allow-Headers`, `Content-Type`);
    next()
  })

  RegisterRoutes(app);

  // Swagger auto-generate
  // const openApi = await fetch('./swagger.json')
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApi));

  // Start
  app.listen(3000, () => console.log(`Table Football API listening at http://localhost:3000`));
})();
