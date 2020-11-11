FROM node:15

WORKDIR /usr/src/app

# This is docker cache optimization.
# All connected packages must be specified below before running yarn install
COPY package.json yarn.lock ./

# The app
COPY api/user-service/package.json api/user-service/package.json

# Deps
COPY packages/api-service/package.json packages/api-service/package.json
COPY packages/domain-event-publisher/package.json packages/domain-event-publisher/package.json

RUN yarn install --network-timeout 100000

# Extra dependency for deveopment
RUN npm install -g nodemon

COPY api api
COPY packages packages

WORKDIR /usr/src/app/api/user-service

EXPOSE 8080
CMD yarn dev
