FROM node:8.1.4-alpine

ENV NODE_ENV production

RUN apk update && apk upgrade && apk add --no-cache make gcc g++ python

RUN npm install -g yarn --silent
RUN yarn global add nodemon

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

WORKDIR /app
RUN yarn install
COPY . /app

CMD ["yarn", "run", "dev"]
