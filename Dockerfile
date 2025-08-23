# syntax=docker/dockerfile:1

########################
# 1. Build (Node)
########################
# Je construis l’app dans une image légère Node 20 (Alpine).
# Je fixe un WORKDIR pour que les commandes suivantes s’exécutent au bon endroit.
FROM node:20-alpine AS build
WORKDIR /app

# Je copie uniquement les manifests pour profiter du cache Docker si le code change
# sans modifier les dépendances. npm ci garantit une install propre, reproductible.
COPY package*.json ./
RUN npm ci

# Je copie ensuite tout le code source et je lance le build Vite/React,
# qui produira des fichiers statiques dans /app/dist.
COPY . .
RUN npm run build    # produit /app/dist

########################
# 2. Runtime (Nginx)
########################
# Je passe sur une image Nginx minimale pour servir les fichiers statiques.
FROM nginx:1.25-alpine AS runtime

# Je dépose le contenu /dist dans le répertoire web par défaut d’Nginx.
COPY --from=build /app/dist /usr/share/nginx/html

# Je documente le port d’écoute (par défaut 80) et je démarre Nginx au premier plan.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
