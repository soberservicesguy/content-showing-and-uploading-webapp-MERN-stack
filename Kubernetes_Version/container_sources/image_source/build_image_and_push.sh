






#!/usr/bin/env bash

docker image build -t content_image_161 .
docker image tag content_image_161 soberservicesguy/portfolio-images:content_image_161
docker image push soberservicesguy/portfolio-images:content_image_161
