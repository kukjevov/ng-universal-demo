FROM node:22-alpine

RUN apk update && apk upgrade
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR approot

RUN npm install --legacy-peer-deps "express@5.2.1" && \
    npm install --legacy-peer-deps "compression@1.8.1" && \
    npm install --legacy-peer-deps "lodash-es@4.18.1" && \
    npm install --legacy-peer-deps "envsub@4.1.0" && \
    npm install --legacy-peer-deps "http-proxy-middleware@4.0.0" && \
    npm install --legacy-peer-deps "yargs@18.0.0" && \
    npm install --legacy-peer-deps "body-parser@1.20.2" && \
    npm install --legacy-peer-deps "@jscrpt/common@7.1.0" && \
    npm install --legacy-peer-deps "extend@3.0.2" && \
    npm install --legacy-peer-deps "chalk@4.1.2" && \
    npm install --legacy-peer-deps "dotenv@17.4.2" && \
    npm install --legacy-peer-deps "tslib@2.8.1" && \
    npm install --legacy-peer-deps "nodejs-connect-extensions@3.0.0"

EXPOSE 8888
EXPOSE 8880

ARG defaultbase=/
ENV BASEURL=$defaultbase

COPY . /approot/
RUN chown -R appuser:appgroup /approot
USER appuser

RUN echo "sed -i -E \"s@base href=\\\"[^\\\"]*\\\"@base href=\\\"\$BASEURL\\\"@\" wwwroot/browser/index.html && node ./.utils/generateConfig.js && cp ./config/configBrowserOverride.js ./wwwroot/browser/$(ls wwwroot/browser | grep configBrowserOverride) && node ./server.js" > run.sh
RUN chmod +x run.sh

CMD ./run.sh