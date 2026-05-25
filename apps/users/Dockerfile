FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nx build users --configuration=production

FROM nginx:alpine
COPY --from=build /app/dist/apps/users /usr/share/nginx/html
COPY apps/users/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
