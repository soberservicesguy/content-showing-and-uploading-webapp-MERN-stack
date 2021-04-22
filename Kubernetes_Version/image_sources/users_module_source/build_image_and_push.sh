#!/usr/bin/env bash

docker image build -t content_user_module_5 .
docker image tag content_user_module_5 soberservicesguy/portfolio-images:content_user_module_5
docker image push soberservicesguy/portfolio-images:content_user_module_5
