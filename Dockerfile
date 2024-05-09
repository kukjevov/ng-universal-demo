FROM node:18.18-alpine

WORKDIR approot

RUN apk update && apk upgrade

RUN npm install --legacy-peer-deps "express@4.19.2" && \
    npm install --legacy-peer-deps "compression@1.7.4" && \
    npm install --legacy-peer-deps "lodash@4.17.21" && \
    npm install --legacy-peer-deps "envsub@4.1.0" && \
    npm install --legacy-peer-deps "http-proxy-middleware@2.0.6" && \
    npm install --legacy-peer-deps "yargs@17.7.2" && \
    npm install --legacy-peer-deps "body-parser@1.20.2" && \
    npm install --legacy-peer-deps "@jscrpt/common@6.0.0" && \
    npm install --legacy-peer-deps "extend@3.0.2" && \
    npm install --legacy-peer-deps "chalk@4.1.2" && \
    npm install --legacy-peer-deps "dotenv@10.0.0" && \
    npm install --legacy-peer-deps "tslib@2.6.2" && \
    npm install --legacy-peer-deps "nodejs-connect-extensions@2.0.5"

EXPOSE 8888
EXPOSE 8880

ARG defaultbase=/
ENV BASEURL=$defaultbase

COPY . /approot/

RUN echo "sed -i -E \"s@base href=\\\"[^\\\"]*\\\"@base href=\\\"\$BASEURL\\\"@\" wwwroot/browser/index.html && node ./generateConfig.js && cp ./config/configBrowserOverride.js ./wwwroot/browser/$(ls wwwroot/browser | grep configBrowserOverride) && node ./server.js" > run.sh
RUN chmod +x run.sh

CMD ./run.sh