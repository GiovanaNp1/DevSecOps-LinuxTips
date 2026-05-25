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

# Cria usuário não-root (id 1000) e usa-o; evita rodar como root no container
RUN addgroup -g 1000 node \
	&& adduser -u 1000 -G node -s /bin/sh -D node

# Copia a aplicação a partir do estágio de build
COPY --from=build /app /app

# Ambiente em runtime (não contém segredos). Se precisar passar valores sensíveis em build,
# use --secret do BuildKit ou variáveis de build (ARG), não ENV com valores embutidos.
ENV NODE_ENV=production

# Porta exposta pela app
EXPOSE 3000

# Executa como usuário não-root
USER node

# Healthcheck simples para o serviço HTTP local (ajuste a rota conforme necessário)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
	CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "index.js"]
