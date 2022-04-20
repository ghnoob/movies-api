FROM node:16.14.2-alpine3.15

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .
