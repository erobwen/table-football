

# Startup

Prerequisites: Make sure docker is running on the system and that node/npm is installed.

* npm start
* front end at: http://localhost:4173/

* api definition at: http://localhost:3000/api-docs


# Develop

Note: On windows where watch wont work inside a folder mounted into a docker environment, it is best to just run all services separatley each in a different terminal window to get proper watch. 

* In docker-compose.yml, comment out the react and node containers. 
* In database.js client, change host to 'localhost'. 
* Start node and react each with npm install, npm start   
* front end at: http://localhost:5173/ 