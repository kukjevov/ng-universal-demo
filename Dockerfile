FROM node:14.16-alpine

WORKDIR approot

RUN apk update && apk upgrade

RUN npm install connect && \
    npm install connect-gzip-static && \
    npm install connect-history-api-fallback && \
    npm install http-proxy-middleware && \
    npm install yargs && \
    npm install body-parser && \
    npm install connect-rest && \
    npm install "@jscrpt/common" && \
    npm install extend && \
    npm install chalk && \
    npm install dotenv && \
    npm install nodejs-connect-extensions

EXPOSE 8888
EXPOSE 8880

COPY . /approot/

CMD node ./server.js