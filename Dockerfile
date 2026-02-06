FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g node-pg-migrate && npm install

COPY . .

CMD sh -c "node-pg-migrate up && npm start"
