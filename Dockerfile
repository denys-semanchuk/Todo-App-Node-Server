FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "--experimental-specifier-resolution=node", "dist/app.js" ]