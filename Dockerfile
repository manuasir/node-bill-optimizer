FROM node:15.0.0-alpine3.10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn

COPY index.js .
COPY src ./src

CMD [ "node", "index.js" ]