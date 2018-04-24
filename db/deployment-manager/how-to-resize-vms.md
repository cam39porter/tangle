## How to resize vms

#### Introduction

This guide tells you how to resize the vms running neo4j causal cluster via gcp deployment manager. This process requires 0 downtime, but will reduce the capacity of your cluster to (n-1)/n for an extended period of time.

#### Prerequisites

This guide assumes you have a cluster running.

#### Actions

**IMPORTANT - PLEASE MAKE SURE THAT YOU FOLLOW THIS FIRST STEP**

1.  Edit the start script for each vm to remove the following lines
    > /usr/bin/neo4j-admin unbind 2>&1 | tee -a $LOGFILE
    > /bin/rm -rf /var/lib/neo4j/data/databases/graph.db/ 2>&1 | tee -a $LOGFILE

This will ensure that your data is not deleted.

2.  Pick one instance and stop the instance in the gcp compute console
3.  Edit the instance and resize as desired
4.  Start the instance (Make sure you have edited the script suggested in step 1. Else you will lose your data.)
5.  Ensure that the instance comes back online by testing CALL dbms.cluster.overview() in the neo4j browser before moving on.
6.  Repeat steps 2-5 for all core servers

All of your instances should be resized and you should have experienced 0 downtime.
