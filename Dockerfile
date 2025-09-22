FROM  node:18-alpine3.20

RUN apk update && apk upgrade

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env.docker ./.env

EXPOSE 5000
CMD [ "npm", "run", "fast-start" ]