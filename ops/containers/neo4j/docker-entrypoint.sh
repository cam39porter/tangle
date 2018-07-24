#!/bin/bash -eu

cmd="$1"


# If we're running as root, then run as the neo4j user. Otherwise
# docker is running with --user and we simply use that user.  Note
# that su-exec, despite its name, does not replicate the functionality
# of exec, so we need to use both
if [ "$(id -u)" = "0" ]; then
  userid="neo4j"
  groupid="neo4j"
  exec_cmd="exec su-exec neo4j"
else
  userid="$(id -u)"
  groupid="$(id -g)"
  exec_cmd="exec"
fi
readonly userid
readonly groupid
readonly exec_cmd

mkdir -p /var/lib/neo4j/certificates/cluster/trusted 
mkdir -p /var/lib/neo4j/certificates/cluster/revoked
cp /etc/neo4j/secrets/public.crt /var/lib/neo4j/certificates/cluster/trusted
cp /etc/neo4j/secrets/public.crt /var/lib/neo4j/certificates/cluster/
cp /etc/neo4j/secrets/private.key /var/lib/neo4j/certificates/cluster/
chown -R "${userid}":"${groupid}" /var/lib/neo4j/certificates
chmod -R 700 /var/lib/neo4j/certificates

# Need to chown the home directory - but a user might have mounted a
# volume here (notably a conf volume). So take care not to chown
# volumes (stuff not owned by neo4j)
if [[ "$(id -u)" = "0" ]]; then
  # Non-recursive chown for the base directory
  chown "${userid}":"${groupid}" /var/lib/neo4j
  chmod 700 /var/lib/neo4j
fi

while IFS= read -r -d '' dir
do
  if [[ "$(id -u)" = "0" ]] && [[ "$(stat -c %U "${dir}")" = "neo4j" ]]; then
    # Using mindepth 1 to avoid the base directory here so recursive is OK
    chown -R "${userid}":"${groupid}" "${dir}"
    chmod -R 700 "${dir}"
  fi
done <   <(find /var/lib/neo4j -type d -mindepth 1 -maxdepth 1 -print0)

if [[ "${cmd}" != *"neo4j"* ]]; then
  if [ "${cmd}" == "dump-config" ]; then
    if [ -d /conf ]; then
      ${exec_cmd} cp --recursive conf/* /conf
      exit 0
    else
      echo >&2 "You must provide a /conf volume"
      exit 1
    fi
  fi
else
  # Only prompt for license agreement if command contains "neo4j" in it
  if [ "$NEO4J_EDITION" == "enterprise" ]; then
    if [ "${NEO4J_ACCEPT_LICENSE_AGREEMENT:=no}" != "yes" ]; then
      echo >&2 "
In order to use Neo4j Enterprise Edition you must accept the license agreement.
(c) Network Engine for Objects in Lund AB.  2017.  All Rights Reserved.
Use of this Software without a proper commercial license with Neo4j,
Inc. or its affiliates is prohibited.
Email inquiries can be directed to: licensing@neo4j.com
More information is also available at: https://neo4j.com/licensing/
To accept the license agreement set the environment variable
NEO4J_ACCEPT_LICENSE_AGREEMENT=yes
To do this you can use the following docker argument:
        --env=NEO4J_ACCEPT_LICENSE_AGREEMENT=yes
"
      exit 1
    fi
  fi
fi

# Env variable naming convention:
# - prefix NEO4J_
# - double underscore char '__' instead of single underscore '_' char in the setting name
# - underscore char '_' instead of dot '.' char in the setting name
# Example:
# NEO4J_dbms_tx__log_rotation_retention__policy env variable to set
#       dbms.tx_log.rotation.retention_policy setting

# Backward compatibility - map old hardcoded env variables into new naming convention (if they aren't set already)
# Set some to default values if unset
: ${NEO4J_dbms_tx__log_rotation_retention__policy:=${NEO4J_dbms_txLog_rotation_retentionPolicy:-"100M size"}}
: ${NEO4J_wrapper_java_additional:=${NEO4J_UDC_SOURCE:-"-Dneo4j.ext.udc.source=docker"}}
: ${NEO4J_dbms_memory_heap_initial__size:=${NEO4J_dbms_memory_heap_maxSize:-"512M"}}
: ${NEO4J_dbms_memory_heap_max__size:=${NEO4J_dbms_memory_heap_maxSize:-"512M"}}
: ${NEO4J_dbms_unmanaged__extension__classes:=${NEO4J_dbms_unmanagedExtensionClasses:-}}
: ${NEO4J_dbms_allow__format__migration:=${NEO4J_dbms_allowFormatMigration:-}}
: ${NEO4J_dbms_connectors_default__advertised__address:=${NEO4J_dbms_connectors_defaultAdvertisedAddress:-}}
: ${NEO4J_ha_server__id:=${NEO4J_ha_serverId:-}}
: ${NEO4J_ha_initial__hosts:=${NEO4J_ha_initialHosts:-}}
: ${NEO4J_causal__clustering_expected__core__cluster__size:=${NEO4J_causalClustering_expectedCoreClusterSize:-}}
: ${NEO4J_causal__clustering_initial__discovery__members:=${NEO4J_causalClustering_initialDiscoveryMembers:-}}
: ${NEO4J_causal__clustering_discovery__listen__address:=${NEO4J_causalClustering_discoveryListenAddress:-"0.0.0.0:5000"}}
: ${NEO4J_causal__clustering_discovery__advertised__address:=${NEO4J_causalClustering_discoveryAdvertisedAddress:-"$(hostname):5000"}}
: ${NEO4J_causal__clustering_transaction__listen__address:=${NEO4J_causalClustering_transactionListenAddress:-"0.0.0.0:6000"}}
: ${NEO4J_causal__clustering_transaction__advertised__address:=${NEO4J_causalClustering_transactionAdvertisedAddress:-"$(hostname):6000"}}
: ${NEO4J_causal__clustering_raft__listen__address:=${NEO4J_causalClustering_raftListenAddress:-"0.0.0.0:7000"}}
: ${NEO4J_causal__clustering_raft__advertised__address:=${NEO4J_causalClustering_raftAdvertisedAddress:-"$(hostname):7000"}}

# unset old hardcoded unsupported env variables
unset NEO4J_dbms_txLog_rotation_retentionPolicy NEO4J_UDC_SOURCE \
    NEO4J_dbms_memory_heap_maxSize NEO4J_dbms_memory_heap_maxSize \
    NEO4J_dbms_unmanagedExtensionClasses NEO4J_dbms_allowFormatMigration \
    NEO4J_dbms_connectors_defaultAdvertisedAddress NEO4J_ha_serverId \
    NEO4J_ha_initialHosts NEO4J_causalClustering_expectedCoreClusterSize \
    NEO4J_causalClustering_initialDiscoveryMembers \
    NEO4J_causalClustering_discoveryListenAddress \
    NEO4J_causalClustering_discoveryAdvertisedAddress \
    NEO4J_causalClustering_transactionListenAddress \
    NEO4J_causalClustering_transactionAdvertisedAddress \
    NEO4J_causalClustering_raftListenAddress \
    NEO4J_causalClustering_raftAdvertisedAddress

# Custom settings for dockerized neo4j
: ${NEO4J_dbms_tx__log_rotation_retention__policy:=100M size}
: ${NEO4J_dbms_memory_pagecache_size:=512M}
: ${NEO4J_wrapper_java_additional:=-Dneo4j.ext.udc.source=docker}
: ${NEO4J_dbms_memory_heap_initial__size:=512M}
: ${NEO4J_dbms_memory_heap_max__size:=512M}
: ${NEO4J_dbms_connectors_default__listen__address:=0.0.0.0}
: ${NEO4J_dbms_connector_http_listen__address:=0.0.0.0:7474}
: ${NEO4J_dbms_connector_https_listen__address:=0.0.0.0:7473}
: ${NEO4J_dbms_connector_bolt_listen__address:=0.0.0.0:7687}
: ${NEO4J_ha_host_coordination:=$(hostname):5001}
: ${NEO4J_ha_host_data:=$(hostname):6001}
: ${NEO4J_dbms_backup_address:=$(hostname):6362}
: ${NEO4J_causal__clustering_discovery__listen__address:=0.0.0.0:5000}
: ${NEO4J_causal__clustering_discovery__advertised__address:=$(hostname):5000}
: ${NEO4J_causal__clustering_transaction__listen__address:=0.0.0.0:6000}
: ${NEO4J_causal__clustering_transaction__advertised__address:=$(hostname):6000}
: ${NEO4J_causal__clustering_raft__listen__address:=0.0.0.0:7000}
: ${NEO4J_causal__clustering_raft__advertised__address:=$(hostname):7000}

# Custom settings for tangle
# Logging
: ${NEO4J_dbms_logs_query_enabled:=true}
: ${NEO4J_dbms_logs_query_time__logging__enabled:=true}
: ${NEO4J_dbms_logs_query_allocation__logging__enabled:=true}
: ${NEO4J_dbms_logs_query_page__logging__enabled:=true}

# Security
: ${NEO4J_dbms_ssl_policy_cluster_base__directory:=certificates/cluster}
: ${NEO4J_dbms_ssl_policy_cluster_base__directory:=certificates/cluster}
: ${NEO4J_dbms_ssl_policy_cluster_tls__versions:=TLSv1.2}
: ${NEO4J_dbms_ssl_policy_cluster_ciphers:=TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384}
: ${NEO4J_dbms_ssl_policy_cluster_client__auth:=REQUIRE}
: ${NEO4J_causal__clustering_ssl__policy:=cluster}
: ${NEO4J_dbms_backup_ssl__policy:=cluster}
: ${NEO4J_dbms_security_causal__clustering__status__auth__enabled:=false}

# Apoc
: ${NEO4J_dbms_security_procedures_unrestricted:=apoc.index.*}
: ${NEO4J_apoc_autoIndex_enabled:=true}
# GraphAware
: ${NEO4J_dbms_unmanaged__extension__classes:=com.graphaware.server=/graphaware}
: ${NEO4J_com_graphaware_runtime_enabled:=true}
: ${NEO4J_com_graphaware_module_UIDM_1:=com.graphaware.module.uuid.UuidBootstrapper}
: ${NEO4J_com_graphaware_module_UIDM_uuidProperty:=uuid}
: ${NEO4J_com_graphaware_module_UIDM_uuidProperty:=uuid}
: ${NEO4J_com_graphaware_module_UIDM_initializeUntil:=1528383992364}
: ${NEO4J_com_graphaware_module_ES_2:=com.graphaware.module.es.ElasticSearchModuleBootstrapper}
: ${NEO4J_com_graphaware_module_ES_port:=9243}
: ${NEO4J_com_graphaware_module_ES_protocol:=https}
: ${NEO4J_com_graphaware_module_ES_index:=neo4j-index}
: ${NEO4J_com_graphaware_module_ES_keyProperty:=uuid}
: ${NEO4J_com_graphaware_module_ES_node:=hasLabel('Capture')}
: ${NEO4J_com_graphaware_module_ES_retryOnError:=true}
: ${NEO4J_com_graphaware_module_ES_queueSize:=2000}
: ${NEO4J_com_graphaware_module_ES_reindexBatchSize:=500}
: ${NEO4J_com_graphaware_module_ES_bulk:=true}
: ${NEO4J_com_graphaware_module_ES_initializeUntil:=1529538950524}

if [ -d /conf ]; then
    find /conf -type f -exec cp {} conf \;
fi

if [ -d /ssl ]; then
    NEO4J_dbms_directories_certificates="/ssl"
fi

if [ -d /plugins ]; then
    NEO4J_dbms_directories_plugins="/plugins"
fi

if [ -d /logs ]; then
    NEO4J_dbms_directories_logs="/logs"
fi

if [ -d /import ]; then
    NEO4J_dbms_directories_import="/import"
fi

if [ -d /metrics ]; then
    NEO4J_dbms_directories_metrics="/metrics"
fi

# set the neo4j initial password only if you run the database server
if [ "${cmd}" == "neo4j" ]; then
    if [ "${NEO4J_AUTH:-}" == "none" ]; then
        NEO4J_dbms_security_auth__enabled=false
    elif [[ "${NEO4J_AUTH:-}" == neo4j/* ]]; then
        password="${NEO4J_AUTH#neo4j/}"
        if [ "${password}" == "neo4j" ]; then
            echo >&2 "Invalid value for password. It cannot be 'neo4j', which is the default."
            exit 1
        fi
        # Will exit with error if users already exist (and print a message explaining that)
        bin/neo4j-admin set-initial-password "${password}" || true
    elif [ -n "${NEO4J_AUTH:-}" ]; then
        echo >&2 "Invalid value for NEO4J_AUTH: '${NEO4J_AUTH}'"
        exit 1
    fi
fi

# list env variables with prefix NEO4J_ and create settings from them
unset NEO4J_AUTH NEO4J_SHA256 NEO4J_TARBALL
for i in $( set | grep ^NEO4J_ | awk -F'=' '{print $1}' | sort -rn ); do
    setting=$(echo ${i} | sed 's|^NEO4J_||' | sed 's|_|.|g' | sed 's|\.\.|_|g')
    value=$(echo ${!i})
    if [[ -n ${value} ]]; then
        if grep -q -F "${setting}=" conf/neo4j.conf; then
            # Remove any lines containing the setting already
            sed --in-place "/${setting}=.*/d" conf/neo4j.conf
        fi
        # Then always append setting to file
        echo "${setting}=${value}" >> conf/neo4j.conf
    fi
done

# Chown the data dir now that (maybe) an initial password has been
# set (this is a file in the data dir)
if [[ "$(id -u)" = "0" ]]; then
  chmod -R 755 /data
  chown -R "${userid}":"${groupid}" /data
fi

[ -f "${EXTENSION_SCRIPT:-}" ] && . ${EXTENSION_SCRIPT}

# Use su-exec to drop privileges to neo4j user
# Note that su-exec, despite its name, does not replicate the
# functionality of exec, so we need to use both
if [ "${cmd}" == "neo4j" ]; then
  ${exec_cmd} neo4j console
elif [ "${cmd}" == "backup" ]; then
  bin/neo4j-admin backup --backup-dir /tmp --name backup --from ${NEO4J_ENDPOINT:-}:6362
elif [ "${cmd}" == "sleep" ]; then
  sleep 1000
else
  ${exec_cmd} "$@"
fi