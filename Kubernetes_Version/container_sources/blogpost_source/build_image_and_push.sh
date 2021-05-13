












#!/usr/bin/env bash

docker image build -t content_blogpost_167 .
docker image tag content_blogpost_167 soberservicesguy/portfolio-images:content_blogpost_167
docker image push soberservicesguy/portfolio-images:content_blogpost_167
