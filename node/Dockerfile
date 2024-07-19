FROM node:alpine
 
WORKDIR /usr/src/app

COPY . .

RUN npm run build

CMD node dist/api.js

EXPOSE 3000