FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY *.ts .
COPY tsconfig.json ./

RUN npm run build

CMD [ "node", "dist/app.js" ]