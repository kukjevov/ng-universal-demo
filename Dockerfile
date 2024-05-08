FROM node:18.18-alpine

WORKDIR approot

RUN apk update && apk upgrade

RUN npm install "express@4.19.2" && \
    npm install "compression@1.7.4" && \
    npm install "lodash@4.17.21" && \
    npm install "envsub@4.1.0" && \
    npm install "http-proxy-middleware@2.0.6" && \
    npm install "yargs@17.7.2" && \
    npm install "body-parser@1.20.2" && \
    npm install "@jscrpt/common@6.0.0" && \
    npm install "extend@3.0.2" && \
    npm install "chalk@4.1.2" && \
    npm install "dotenv@10.0.0" && \
    npm install "tslib@2.6.2" && \
    npm install "nodejs-connect-extensions@2.0.5"

EXPOSE 8888
EXPOSE 8880

ARG defaultbase=/
ENV BASEURL=$defaultbase

COPY . /approot/

RUN echo "sed -i -E \"s@base href=\\\"[^\\\"]*\\\"@base href=\\\"\$BASEURL\\\"@\" wwwroot/index.html && node generateConfig.js && node ./server.cjs" > run.sh
RUN chmod +x run.sh

CMD ./run.sh