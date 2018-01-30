# Cloud Functions

> This directory contains all of our Google Cloud Platform (GCP) Cloud Functions. Each subdirectory contains a single Cloud Function that is deployed separately from all other Cloud Functions.

## Deploying

> There are three types of Cloud Functions that can deployed. These are Cloud Functions triggered by HTTP, Cloud Pub/Sub, and Cloud Storage. Each of these has similar deployment pattern. They are summarized below.

### HTTP Triggers

> This section will go through deploying a Cloud Function with an HTTP trigger. In order to achieve this we will be using the `hello-http` as example an example.

1. Create a Cloud Function with an HTTP trigger.

2. Once you are ready to deploy this function, push your branch and put in a pull request to `master`.

3. Once your branch has been merged with `master`, deploy your branch to our organization `hex-ventures` and our project `opit` in GCP using the following command.

```sh
gcloud beta functions deploy helloHttp --source h
ttps://source.developers.google.com/projects/opit-193719/repos/hex-ventures/moveabl
e-aliases/master/paths/cloud-functions/hello-world --trigger-http
```

4. Your function is now deployed. You can check for it on GCP console and use the url outputted to test hitting the function.

### Cloud Pub/Sub Triggers

[TODO]

### Cloud Storage Trigger

[TODO]