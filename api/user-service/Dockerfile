FROM node:15

# Dockerize is needed to sync containers startup
ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

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
