


















#!/usr/bin/env bash

docker image build -t content_blogpost_173 .
docker image tag content_blogpost_173 soberservicesguy/portfolio-images:content_blogpost_173
docker image push soberservicesguy/portfolio-images:content_blogpost_173
