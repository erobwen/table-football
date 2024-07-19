FROM node:alpine
 
WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm build

CMD npm run preview

EXPOSE 5173