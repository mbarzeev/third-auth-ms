FROM node:lts-alpine

RUN apk add dumb-init

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE ${PORT}

USER node

CMD ["dumb-init", "node", "./src/index.js"]