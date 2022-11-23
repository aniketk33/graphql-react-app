FROM node:latest

WORKDIR /app

COPY Backend/package.json .

RUN npm install

COPY . .

EXPOSE 3000

VOLUME [ "/app/node_modules" ]

CMD [ "npm", "start" ]