


















#!/usr/bin/env bash

docker image build -t content_user_module_174 .
docker image tag content_user_module_174 soberservicesguy/portfolio-images:content_user_module_174
docker image push soberservicesguy/portfolio-images:content_user_module_174
