#####################################################################
# 1️⃣  STAGE « builder » – compile l’app React (Vite) en /dist
#####################################################################
FROM node:20-alpine AS builder

# ‑‑ Crée dossier de travail
WORKDIR /app

# ‑‑ Copie package.json + lockfile et installe en mode CI
COPY package*.json ./
RUN npm ci --omit=dev

# ‑‑ Copie l’ensemble du code puis build
COPY . .
RUN npm run build          # => /app/dist

#####################################################################
# 2️⃣  STAGE « runtime » – sert les fichiers statiques avec Nginx
#####################################################################
FROM nginx:1.25-alpine AS runtime

# ‑‑ Copie la build dans le dossier web d’Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# ‑‑ Remplace la conf par défaut pour gérer le fallback SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
