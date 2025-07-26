FROM node:22-alpine AS build

# Usa o diretório raiz do container
WORKDIR /

# Copia arquivos de dependências
COPY package*.json ./
RUN npm ci

# Copia todo o restante do projeto
COPY . .

# Roda build apenas se existir
RUN npm run build || echo "sem etapa build"

# ====== Fase final ======
FROM node:22-alpine

WORKDIR /

# Copia tudo do estágio de build
COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "index.js"]
