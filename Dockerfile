FROM node:10.7-alpine

WORKDIR approot

RUN apk update && apk upgrade

RUN npm set registry http://nexus/repository/ACE_Npm_Group/ && \
    npm install connect && \
    npm install connect-gzip-static && \
    npm install connect-history-api-fallback && \
    npm install http-proxy-middleware && \
    npm install yargs && \
    npm install body-parser && \
    npm install nodejs-connect-extensions

EXPOSE 8888
EXPOSE 8880

COPY . /approot/

CMD node ./server.js