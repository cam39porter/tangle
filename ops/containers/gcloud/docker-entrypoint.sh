#!/bin/bash -eu

DATE=`date '+%Y-%m-%d-%H-%M-%S'`
gcloud auth activate-service-account --key-file /var/secrets/key.json
gsutil -m rsync -r -d /tmp/backup gs://${BACKUP_BUCKET}/$DATE/backup