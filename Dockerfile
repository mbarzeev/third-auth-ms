FROM node:14.4.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE ${PORT}

CMD ["node", "./src/index.js"]