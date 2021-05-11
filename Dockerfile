FROM node:14.15.5-alpine3.10

WORKDIR /home/node/app

ADD . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "prod:start" ]
