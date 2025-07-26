FROM node:22-alpine AS build

# WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build || echo "sem etapa build"

FROM node:22-alpine

# WORKDIR /app

COPY --from=build .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "index.js"]
