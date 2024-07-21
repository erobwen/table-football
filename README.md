# Startup

Prerequisites: Make sure docker is running on the system and that node/npm is installed.

* npm start
* front end at: http://localhost:5173/ (note it says port 4173 on the console, but it is redirected to 5173 in the docker composition)

* api definition at: http://localhost:3000/api-docs

Note: docker containers will contained built versions of the services. 

# Demo

To quickly add some demo data to your database, you can send POST to the http://localhost:3000/api/demo endpoint. Easiest way to do it is from the api definition. Note: this will clear the database first!  


# Develop

Note: On windows where watch wont work inside a folder mounted into a docker environment, it is best to just run all services separatley each in a different terminal window to get proper watch. 

* In docker-compose.yml, comment out the react and node containers. 
* In database.js client, change host to 'localhost'. 
* Start node and react each with npm install, npm start   
* front end at: http://localhost:5173/ 


# Project Structure

react - frontend
node - backend


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

