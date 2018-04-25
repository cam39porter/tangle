List of changes applied to vms

Dev

In /etc/neo4j/neo4j.template, add

* dbms.security.procedures.unrestricted=apoc.index.\*
* apoc.autoIndex.enabled=true

In /var/lib/neo4j/plugins

* sudo wget https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/3.3.0.2/apoc-3.3.0.2-all.jar

Prod
