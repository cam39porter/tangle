# Graph Database

## [Helm Chart](https://github.com/kubernetes/charts/tree/master/stable/neo4j)

## Setup

> This section describes setting up a Kubernetes Engine Cluster with Neo4j graph database using Helm.

This guide was inspired by these resources:

* [Kubernetes Engine Quick Start](https://cloud.google.com/kubernetes-engine/docs/quickstart)

* [Continuous Delivery for Helm Charts on Kubernetes Engine using Concourse](https://cloud.google.com/solutions/continuous-integration-helm-concourse)

* [Neo4j Clusters on Kubernetes](https://neo4j.com/blog/kubernetes-deploy-neo4j-clusters/)

1. Create cluster from GCP console `gcloud container clusters create graph-database`

```sh
Creating cluster graph-database...done.
Created [https://container.googleapis.com/v1/projects/opit-193719/zones/us-east1-c/clusters/graph-database].
To inspect the contents of your cluster, go to: https://console.cloud.google.com/kubernetes/workload_/gcloud/us-east1-c/g
raph-database?project=opit-193719
kubeconfig entry generated for graph-database.
NAME            LOCATION    MASTER_VERSION  MASTER_IP      MACHINE_TYPE   NODE_VERSION  NUM_NODES  STATUS
graph-database  us-east1-c  1.7.12-gke.0    35.185.53.125  n1-standard-1  1.7.12-gke.0  3          RUNNING
```

2. Download and install the shell binary in the GCP console `wget https://storage.googleapis.com/kubernetes-helm/helm-v2.6.2-linux-amd64.tar.gz`.


```sh
--2018-02-02 15:32:07--  https://storage.googleapis.com/kubernetes-helm/helm-v2.6.2-linux-amd64.tar.gz
Resolving storage.googleapis.com (storage.googleapis.com)... 74.125.141.128, 2607:f8b0:400c:c06::80
Connecting to storage.googleapis.com (storage.googleapis.com)|74.125.141.128|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 16320359 (16M) [application/x-tar]
Saving to: ‘helm-v2.6.2-linux-amd64.tar.gz’
helm-v2.6.2-linux-amd64.tar.gz 100%[=================================================>]  15.56M  65.0MB/s    in 0.2s
2018-02-02 15:32:08 (65.0 MB/s) - ‘helm-v2.6.2-linux-amd64.tar.gz’ saved [16320359/16320359]
```

2. Extract the file `tar zxfv helm-v2.6.2-linux-amd64.tar.gz && cp linux-amd64/helm `

```sh
linux-amd64/
linux-amd64/helm
linux-amd64/LICENSE
linux-amd64/README.md
```

3. Initialize Helm to install Tiller, the server side of Helm `./helm init && ./helm repo update`

```sh
Creating /home/cam/.helm
Creating /home/cam/.helm/repository
Creating /home/cam/.helm/repository/cache
Creating /home/cam/.helm/repository/local
Creating /home/cam/.helm/plugins
Creating /home/cam/.helm/starters
Creating /home/cam/.helm/cache/archive
Creating /home/cam/.helm/repository/repositories.yaml
$HELM_HOME has been configured at /home/cam/.helm.
Tiller (the Helm server-side component) has been installed into your Kubernetes Cluster.
Happy Helming!
```

4. Check that Helm and Tiller that have been installed run `kubectl get deployments -l 'app=helm' --all-namespaces`

```sh
NAMESPACE     NAME            DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
kube-system   tiller-deploy   1         1         1            1           4m
```

5. Check that you have access to the Neo4j chart by running `./helm search neo4j`

```sh
NAME            VERSION DESCRIPTION
stable/neo4j    0.5.0   Neo4j is the worlds leading graph database
```

6. We are now going to deploy our Neo4j cluster with auth disabled for development by running `./helm install stable/neo4j --name neo4j-helm --wait --set authEnabled=false`

```sh
NAME:   neo-helm
LAST DEPLOYED: Fri Feb  2 15:43:10 2018
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/ConfigMap
NAME                  DATA  AGE
neo-helm-neo4j-tests  1     1m

==> v1/Service
NAME            CLUSTER-IP  EXTERNAL-IP  PORT(S)   AGE
neo-helm-neo4j  None        <none>       7474/TCP  1m

==> v1beta1/Deployment
NAME                    DESIRED  CURRENT  UP-TO-DATE  AVAILABLE  AGE
neo-helm-neo4j-replica  0        0        0           0          1m

==> v1beta1/StatefulSet
NAME                 DESIRED  CURRENT  AGE
neo-helm-neo4j-core  3        3        1m


NOTES:
Well need to wait a few seconds for the Neo4j cluster to form.
neo-helm-neo4j-replica  0        0        0           0          1m
We need to see this line in all of our pods logs:
> Remote interface available at http://neo-helm-neo4j-core-2.neo-helm-neo4j.default.svc.cluster.local:7474/
We can see the content of the logs by running the following command:
kubectl logs -l "app=neo4j,component=core"
We can now run a query to find the topology of the cluster.
kubectl run -it --rm cypher-shell \
    --image=neo4j:3.2.3-enterprise \
    --restart=Never \
    --namespace default \
    --command -- ./bin/cypher-shell -u neo4j -p <password> --a neo-helm-neo4j.default.svc.cluster.local "call dbms.cluste
r.overview()"
This will print out the addresses of the members of the cluster.
Note:
Youll need to substitute <password> with the password you set when installing the Helm package.
If you didnt set a password, one will be auto generated.
You can find the base64 encoded version of the password by running the following command:
kubectl get secrets neo-helm-neo4j-secrets -o yaml
```

7. If we want to add read replicas to our cluster, we can scale the deployment with this command `kubectl scale deployment neo-helm-neo4j-replica  --replicas=3
deployment "neo-helm-neo4j-replica" scaled`

```sh
deployment "neo-helm-neo4j-replica" scaled
```

8. We can check if the scaling worked by running `kubectl exec neo4j-helm-neo4j-core-0 -- bin/cypher-shell --format verbose "CALL dbms.cluster.overview() YIELD id, role RETURN id, role"`

```sh
+---------------------------------------------------------+
| id                                     | role           |
+---------------------------------------------------------+
| "0beaaac7-7a94-4f36-9092-bc0208feb0be" | "LEADER"       |
| "99c6d2df-9c7d-44d7-b077-ab8972bc5292" | "FOLLOWER"     |
| "c9248c80-d555-4d73-b6b5-771c6a0cfefc" | "FOLLOWER"     |
| "292bba6a-b7c7-4b6d-86a7-5882b9f970ad" | "READ_REPLICA" |
| "8957f0b5-1f19-4be8-bfed-3c0a0ab85ebb" | "READ_REPLICA" |
| "281bcddc-e71f-45a7-804b-93575ae5b5cb" | "READ_REPLICA" |
+---------------------------------------------------------+
6 rows available after 472 ms, consumed after another 30 ms
```

9. We can put something test data to make sure it is working by running `kubectl exec neo4j-helm-neo4j-core-0 -- bin/cypher-shell "UNWIND range(0, 1000) AS id CREATE (:Person {id: id}) RETURN COUNT(*)"`

```sh
COUNT(*)
1001
```

10. We can check that this command reached the other cluster members by running `kubectl exec neo4j-helm-neo4j-core-2 -- bin/cypher-shell "MATCH (:Person) RETURN COUNT(*)"`

```sh
COUNT(*)
1001
```

## [Local Connection](https://github.com/neo4j-contrib/kubernetes-neo4j)

1. Install `gcloud` sdk.

2. Install `kubectl` by running `gcloud components install kubectl`.

3. Check for graph database cluster `gcloud container clusters list`

4. Authenticate with the cluster `gcloud container clusters get-credentials graph-database --zone us-east1-c && gcloud auth application-default login`

5. Forward your local ports to the kubernetes cluster `kubectl port-forward neo-4j-helm-neo4j-core-0 8474:7447 8687:7687`

6. Open `http://localhost:8474` and type `:server connect` if it doesn’t do it automatically. We then need to update the Host field to be `bolt://localhost:8687` and fill in a username and password if applicable.