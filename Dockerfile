FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

CMD [ "node", "dist/app.js" ]  # Adjust entry point if needed