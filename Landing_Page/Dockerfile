# Etap budowy
FROM node:20-alpine AS builder

WORKDIR /app

# Kopiowanie plików pakietów i instalacja zależności
COPY package*.json ./
RUN npm install

# Kopiowanie reszty kodu aplikacji
COPY . .

# Budowanie aplikacji (tryb hybrid: statyczne strony + serwerowy endpoint /api/contact)
RUN npm run build

# Etap serwowania — Node (adapter @astrojs/node, standalone)
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Tylko zależności produkcyjne (m.in. nodemailer używany w runtime)
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
