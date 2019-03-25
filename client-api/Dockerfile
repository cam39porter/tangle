FROM node:10

COPY . ./usr/src/client-api

RUN cd ./usr/src/client-api \
  && npm install \
  && npm run build

EXPOSE 8080

WORKDIR ./usr/src/client-api

CMD ["npm", "start"]