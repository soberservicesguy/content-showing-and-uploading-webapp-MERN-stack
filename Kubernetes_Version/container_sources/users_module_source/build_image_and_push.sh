















#!/usr/bin/env bash

docker image build -t content_user_module_171 .
docker image tag content_user_module_171 soberservicesguy/portfolio-images:content_user_module_171
docker image push soberservicesguy/portfolio-images:content_user_module_171
