FROM node:8

ENV NODE_ENV="development" \
  NEO4J_ENDPOINT="bolt+routing://35.197.60.182:7687" \
  NEO4J_USER="neo4j" \
  NEO4J_PASSWORD="mz6bJV6YC9irutUo" \
  GCLOUD_PROJECT="opit-193719"

COPY . ./usr/src/client-api

RUN cd ./usr/src/client-api \
  && npm install \
  && npm run build

EXPOSE 8080

WORKDIR ./usr/src/client-api

CMD ["npm", "start"]