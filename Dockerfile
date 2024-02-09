FROM node:21-alpine3.18 as build
WORKDIR /app


RUN npm install -g npm@10.4.0

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /app/dist /var/www/html/
EXPOSE 80
CMD ["nginx","-g","daemon on;"]