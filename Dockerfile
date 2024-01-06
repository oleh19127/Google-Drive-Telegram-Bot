FROM node:hydrogen-slim

WORKDIR /app

COPY . .

RUN npm i

CMD [ "npm", "run", "start" ]