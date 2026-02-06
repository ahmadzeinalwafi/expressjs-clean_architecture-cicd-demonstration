FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g node-pg-migrate && npm install

COPY . .

CMD sh -c "echo '--- DEBUG INFO ---' && ls -la node_modules/.bin && echo '--- PACKAGE.JSON ---' && cat package.json && echo '--- END DEBUG ---' && npm run migrate up && npm start"
