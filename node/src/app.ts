import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from "../tsoa_build/routes";
import openApi from '../tsoa_build/swagger.json?raw'; // Shows as error, but works somehow.

(async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  RegisterRoutes(app);
  
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

  // Swagger auto-generate
  // const openApi = await fetch('../tsoa_build/swagger.json')
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApi));

  // Start
  app.listen(3000, () => console.log(`Example app listening at http://localhost:3000`));
})();




// const swaggerDocs = {};q
// const specOptions: ExtendedSpecConfig = {
//   basePath: "/api",
//   entryFile: "src/app.ts",
//   specVersion: 3,
//   outputDirectory: "src/dist",
//   controllerPathGlobs: ["./routeControllers/**/*Controller.ts"],
//   noImplicitAdditionalProperties: "throw-on-extras"
// };

// const routeOptions: ExtendedRoutesConfig = {
//   basePath: "/api",
//   entryFile: "./src/app.ts",
//   routesDir: "./src",
//   bodyCoercion: false,
//   noImplicitAdditionalProperties: "throw-on-extras"
// };

// const openApi = await generateSpec(specOptions);

// app.use(await generateRoutes(routeOptions));