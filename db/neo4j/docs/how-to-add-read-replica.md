## How to resize vms

#### Introduction

This guide tells you how to add a read replica to a neo4j cluster running via GCP's deployment manager.

#### Prerequisites

This guide assumes you have a cluster running.

#### Actions

**IMPORTANT - PLEASE MAKE SURE THAT YOU FOLLOW THIS FIRST STEP**

1.  Take an existing vm and click clone.
2.  Make sure to edit the dbms mode to READ_REPLICA if you are cloning from a CORE member
3.  Edit the start script to include the following lines between neo4j stop and neo4j start

```sh
/usr/bin/neo4j-admin unbind 2>&1 | tee -a $LOGFILE
/bin/rm -rf /var/lib/neo4j/data/databases/graph.db/ 2>&1 | tee -a $LOGFILE
```

> This will ensure that the read replica is not polluting with an existing db and raft log, but can be brought up to speed.

4.  After clicking start, wait for the instance to come online
5.  Go back and remove those two lines from the script so that you do not wipe the db every time you restart the vm
