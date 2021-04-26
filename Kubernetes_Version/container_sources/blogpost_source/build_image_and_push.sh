


#!/usr/bin/env bash

docker image build -t content_blogpost_157 .
docker image tag content_blogpost_157 soberservicesguy/portfolio-images:content_blogpost_157
docker image push soberservicesguy/portfolio-images:content_blogpost_157
