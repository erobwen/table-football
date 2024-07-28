# About 

This is a table football score tracker, full stack application. It was built in around 16 hours of work, and runs fully dockerized with an open-api/swagger definition for the back end and React for the front end. The application has 4 modal forms, and 3 different pages, one with a filter to warch team on team statistics. 

The backend is built using Node.js and Typescript, using tsoa to generate paths and swagger specifications automatically. All data is stored in a Postgres-SQL database.

The front end is built with React, using Reacts built in state management for simplicity. Styling was made using mostly inline styling for simplicity.  

# Run the application

Prerequisites: Make sure docker is running on the system and that node/npm is installed.

* npm start
* front end at: http://localhost:5173/ (note it says port 4173 on the console, but it is redirected to 5173 in the docker composition)
* Add your own players, or add demo data (see below)

* api definition at: http://localhost:3000/api-docs

Note: docker containers will contained built versions of the services. 

# Demo Data

To quickly add some demo data to your database, you can send POST to the http://localhost:3000/api/demo endpoint. Easiest way to do it is from the api definition (http://localhost:3000/api-docs). Note: this will clear the database first!

# Screenshots

![Alt text](/screenshot1.png?raw=true "Screenshot 1")
*Main screen*

![Alt text](/screenshot2.png?raw=true "Screenshot 2")
*Statistics between two selected teams*

![Alt text](/screenshot3.png?raw=true "Screenshot 3")
*Ongoing game screen*

# Develop

Note: On windows where watch wont work inside a folder mounted into a docker environment, it is best to just run all services separatley each in a different terminal window to get proper watch. 

* In docker-compose.yml, comment out the react and node containers. 
* In database.js client, change host to 'localhost'. 
* Start node and react each with npm install, npm start   
* front end at: http://localhost:5173/ 

# Project Structure

* react - frontend
* node - backend


# Tech used in this project. 

overall: 
 * docker/docker-compose

frontend: 
 * React
 * Vite
 * MUI
 * no particular state management (just plain useState)
 * Typescript (mixed js/ts, ts mostly used for client/data processing)

backend: 
 * Node.js, 
 * Typescript
 * tsoa to generate routes and automatically generate Swagger specificaitons from Typescript.  

