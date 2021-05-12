








#!/usr/bin/env bash

docker image build -t content_image_163 .
docker image tag content_image_163 soberservicesguy/portfolio-images:content_image_163
docker image push soberservicesguy/portfolio-images:content_image_163
