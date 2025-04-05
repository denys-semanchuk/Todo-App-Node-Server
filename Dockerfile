# Шаг 1: Сборка (используем node:20)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Устанавливаем зависимости и компилируем TS
RUN npm install
RUN npm run build  # "build": "tsc" в package.json

# Шаг 2: Запуск (используем только нужные файлы)
FROM node:20-alpine
WORKDIR /app

# Копируем только package.json и dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Устанавливаем ТОЛЬКО production-зависимости
RUN npm install --only=production

# Запускаем приложение
CMD ["node", "dist/index.js"]  # или другой entry-point