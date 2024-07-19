FROM node:alpine
 
WORKDIR /usr/src/app

COPY . .

RUN npm build

CMD node dist/index.js

EXPOSE 3000