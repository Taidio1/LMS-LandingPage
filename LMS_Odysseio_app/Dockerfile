# Etap budowy
FROM node:20-alpine AS builder

WORKDIR /app

# Kopiowanie plików pakietów i instalacja zależności
COPY package*.json ./
RUN npm install

# Kopiowanie reszty kodu aplikacji
COPY . .

# Budowanie aplikacji (Vite generuje pliki statyczne w folderze /dist)
RUN npm run build

# Etap serwowania z użyciem lekkiego Nginx
FROM nginx:alpine

# Usunięcie domyślnej konfiguracji Nginx i skopiowanie własnych zasobów statycznych
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Własny config nginx z SPA fallbackiem (client-side routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
