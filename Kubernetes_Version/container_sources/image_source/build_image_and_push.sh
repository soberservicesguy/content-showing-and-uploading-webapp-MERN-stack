


#!/usr/bin/env bash

docker image build -t content_image_157 .
docker image tag content_image_157 soberservicesguy/portfolio-images:content_image_157
docker image push soberservicesguy/portfolio-images:content_image_157
