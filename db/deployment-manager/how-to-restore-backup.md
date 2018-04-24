## How to restore backup to new cluster

#### Introduction

This guide should be used only in a disaster situation, aka data has been corrupted and we must restore from a backup. This process includes downtime. However if you have lost data, you have worse problems.

Note: this may not be the best way to do this, but this is how I figured it out

#### Prerequisites

This guide assumes you have a backup taken from an online neo4j db via the command

> sudo neo4j-admin backup --backup-dir=/mnt/graph.db-backup --name=graph.db-backup
> And you have placed it in /mnt/graph.db-backup on each core neo4j server

This guide also assumes the site is down and you are not writing to the database anymore

#### Actions

1.  Deploy new cluster with deployment manager
2.  Restore backup to a new database
    > sudo neo4j-admin restore --from=/mnt/graph.db-backup --database=new.db
3.  Stop all core servers. Make sure to wait for each node to stop before proceeding to the next one
    > sudo service neo4j stop
4.  Unbind each server so that you can form a new cluser with the restored data
    > sudo neo4j-admin unbind
5.  Change the database for each server
    > sudo vi /etc/neo4j/neo4j.template
    > Uncomment line that specifies the database at the top of the file, and change it to point to new.db
6.  Change the ownership of data locations to neo4j
    > sudo chown -R neo4j:neo4j /var/log/neo4j
    > sudo chown -R neo4j:neo4j /var/lib/neo4j
7.  Start each server
    > sudo service neo4j start

Now, all core servers should come back online and you should be receiving traffic.
