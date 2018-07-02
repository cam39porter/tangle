FROM openjdk:8-jre-alpine

RUN apk add --no-cache --quiet \
  bash \
  curl \
  tini \
  which \
  python 

RUN curl -sSL https://sdk.cloud.google.com | bash

ENV PATH $PATH:/root/google-cloud-sdk/bin

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod -R 777 /docker-entrypoint.sh

ENTRYPOINT ["/sbin/tini", "-g", "--", "/docker-entrypoint.sh"]
