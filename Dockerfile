FROM node:14.15.5-alpine3.10 AS dev

EXPOSE 3000

WORKDIR /opt/app
RUN chown -R node:node .

# Normal user
USER node

# Install only dependencies
COPY --chown=node:node package.json package-lock.json /opt/app/
# RUN npm --global-folder ./node_modules/ --cache-folder ./node_modules/

CMD [ "npm", "start" ]

FROM dev as prod

# Install the rest of the code
COPY --chown=node:node . /opt/app

RUN npm run build
CMD [ "yarn", "prod:start" ]
