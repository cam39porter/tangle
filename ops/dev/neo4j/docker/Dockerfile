FROM openjdk:8-jre-alpine

RUN addgroup -S neo4j && adduser -S -H -h /var/lib/neo4j -G neo4j neo4j

ENV NEO4J_SHA256=d000f1b6afb1cec3cf1cde99c75555d38f579b58e467eebe32e2353fdf9effa3 \
    NEO4J_TARBALL=neo4j-enterprise-3.4.0-unix.tar.gz \
    NEO4J_EDITION=enterprise

ARG NEO4J_URI=http://dist.neo4j.org/neo4j-enterprise-3.4.0-unix.tar.gz \
    APOC_URI=https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/3.4.0.1/apoc-3.4.0.1-all.jar \
    APOC=apoc-3.4.0.1-all.jar


RUN apk add --no-cache --quiet \
    bash \
    curl \
    tini \
    su-exec \
    && curl --fail --silent --show-error --location --remote-name ${NEO4J_URI} \
    && echo "${NEO4J_SHA256}  ${NEO4J_TARBALL}" | sha256sum -csw - \
    && tar --extract --file ${NEO4J_TARBALL} --directory /var/lib \
    && mv /var/lib/neo4j-* /var/lib/neo4j \
    && rm ${NEO4J_TARBALL} \
    && mv /var/lib/neo4j/data /data \
    && curl --fail --silent --show-error --location --remote-name ${APOC_URI}
    && mv ${APOC} /data/plugins \
    && chown -R neo4j:neo4j /data \
    && chmod -R 777 /data \
    && chown -R neo4j:neo4j /var/lib/neo4j \
    && chmod -R 777 /var/lib/neo4j \
    && ln -s /data /var/lib/neo4j/data \
    && apk del curl

ENV PATH /var/lib/neo4j/bin:$PATH

WORKDIR /var/lib/neo4j

VOLUME /data

COPY docker-entrypoint.sh /docker-entrypoint.sh

EXPOSE 7474 7473 7687

ENTRYPOINT ["/sbin/tini", "-g", "--", "/docker-entrypoint.sh"]
CMD ["neo4j"]