FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN rm -f package-lock.json && npm install

COPY . .

CMD sh -c "npm run migrate up && npm start"
