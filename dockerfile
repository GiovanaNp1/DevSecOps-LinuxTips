FROM node:22-alpine AS build

# Defina um diretório de trabalho de aplicação (evita usar raiz do FS)
WORKDIR /app

# Copia apenas os manifests primeiro para otimizar cache
COPY package*.json ./
RUN npm ci

# Copia o restante do código e roda build (se existir)
COPY . .
RUN npm run build || echo "no build step"

# ====== Fase final ======
FROM node:22-alpine

WORKDIR /app

# Use o usuário `node` já existente no base image e ajuste permissões
# (o base image node:alpine já fornece o usuário/group `node`)
COPY --from=build /app /app
RUN chown -R node:node /app

# Ambiente em runtime (não contém segredos). Se precisar passar valores sensíveis em build,
# use --secret do BuildKit ou variáveis de build (ARG), não ENV com valores embutidos.
ENV NODE_ENV=production

# Porta exposta pela app
EXPOSE 3000

# Executa como usuário não-root
USER node

# Healthcheck simples usando node embutido (não depende de wget/curl)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
	CMD node -e "const http=require('http');const req=http.get('http://127.0.0.1:3000',res=>{process.exit(0)});req.on('error',()=>process.exit(1));setTimeout(()=>process.exit(1),4000)"

CMD ["node", "index.js"]
