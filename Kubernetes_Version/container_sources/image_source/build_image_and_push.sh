




#!/usr/bin/env bash

docker image build -t content_image_159 .
docker image tag content_image_159 soberservicesguy/portfolio-images:content_image_159
docker image push soberservicesguy/portfolio-images:content_image_159
