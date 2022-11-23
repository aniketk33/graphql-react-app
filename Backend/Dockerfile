FROM node:latest

WORKDIR /app

COPY Frontend/stats-visualize-react/package.json .

RUN npm install

COPY . .

EXPOSE 4000

VOLUME [ "/app/node_modules" ]

CMD ["npm", "start"]