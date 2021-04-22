#!/usr/bin/env bash

docker image build -t content_app_blogpost_5 .
docker image tag content_app_blogpost_5 soberservicesguy/portfolio-images:content_app_blogpost_5
docker image push soberservicesguy/portfolio-images:content_app_blogpost_5
