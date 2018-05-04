## How to enable automatic backups

#### Introduction

This guide tells you how to set up a workflow for backuping up a neo4j in a consistent manner, and uploading that to google cloud storage

#### Prerequisites

This guide assumes you have a cluster running.

#### Actions

1.  Create a read replica. I did these three things, not sure exactly which one worked (or maybe all three)

* For the vm's access scopes, set Compute Engine to Read Write
* For the vm's access scopes, set Storage to Full
* For the vm's service account (9191308198-compute@developer.gserviceaccount.com), add Storage Object Create role on IAM page

2.  ssh into the vm
3.  scp the script in /scripts/backup.sh to /etc/cron.[desired-time-frame]/
4.

> sudo mkdir /var/lib/neo4j/backups

5.

> sudo crontab -e
> Add the line "0 3 \* \* \* /etc/cron.daily/backup.sh" (For a daily backup) For other time frames check out
> https://awc.com.my/uploadnew/5ffbd639c5e6eccea359cb1453a02bed_Setting%20Up%20Cron%20Job%20Using%20crontab.pdf

6.  Done!
