#!/bin/bash

scp -i ~/Documents/workspace/cole-default.pem .compiled/index.js ubuntu@ec2-34-222-241-88.us-west-2.compute.amazonaws.com:api
