













#!/usr/bin/env bash

docker image build -t content_user_module_169 .
docker image tag content_user_module_169 soberservicesguy/portfolio-images:content_user_module_169
docker image push soberservicesguy/portfolio-images:content_user_module_169
