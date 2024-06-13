FROM node:lts

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

ARG buildtime_version=''
ENV version=$buildtime_version

EXPOSE 20077
CMD [ "node", "server/index.js" ]

