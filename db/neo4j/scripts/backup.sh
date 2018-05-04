echo "Running backup script..."

neo4j-admin backup --backup-dir=/var/lib/neo4j/backups --name=daily-backup
gsutil -m cp -r /var/lib/neo4j/backups/daily-backup  gs://opit-neo4j-dev-backups/daily/

echo "Completed backup script."