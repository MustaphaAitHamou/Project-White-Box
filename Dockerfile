# syntax=docker/dockerfile:1

########################
# 1. Build (Node)
########################
FROM node:20-alpine AS build
WORKDIR /app

# Installe TOUTES les deps (y compris dev) pour pouvoir builder
COPY package*.json ./
RUN npm ci

# Copie le code et build
COPY . .
RUN npm run build    # produit /app/dist

########################
# 2. Runtime (Nginx)
########################
FROM nginx:1.25-alpine AS runtime
# Copie le build statique dans nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
