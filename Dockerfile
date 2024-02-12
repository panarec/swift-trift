FROM node:21-alpine3.18 as build
WORKDIR /app


RUN npm install -g npm@10.4.0

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf