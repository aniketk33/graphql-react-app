FROM node:latest

WORKDIR /app

COPY Frontend/stats-visualize-react/package.json .

RUN npm install

COPY . .

EXPOSE 3000

VOLUME [ "/app/node_modules" ]

CMD [ "npm", "start" ]