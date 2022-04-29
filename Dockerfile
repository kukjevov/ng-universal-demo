FROM node:14.18-alpine

WORKDIR approot

RUN apk update && apk upgrade

RUN npm install "connect@3.7.0" && \
    npm install "connect-gzip-static@2.1.1" && \
    npm install "connect-history-api-fallback@1.6.0" && \
    npm install "http-proxy-middleware@2.0.2" && \
    npm install "yargs@17.2.1" && \
    npm install "body-parser@1.19.0" && \
    npm install "connect-rest@3.0.33" && \
    npm install "@jscrpt/common@2.3.0" && \
    npm install "extend@3.0.2" && \
    npm install "chalk@4.1.2" && \
    npm install "dotenv@10.0.0" && \
    npm install "tslib@2.3.1" && \
    npm install "nodejs-connect-extensions@2.0.2"

EXPOSE 8888
EXPOSE 8880

ARG defaultbase=/
ENV BASEURL=$defaultbase

COPY . /approot/

RUN echo "sed -i -E \"s@base href=\\\"[^\\\"]*\\\"@base href=\\\"\$BASEURL\\\"@\" wwwroot/index.html && node ./server.cjs" > run.sh
RUN chmod +x run.sh

CMD ./run.sh