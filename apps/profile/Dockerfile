FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nx build profile --configuration=production

FROM nginx:alpine
COPY --from=build /app/dist/apps/profile /usr/share/nginx/html
COPY apps/profile/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
