


#!/usr/bin/env bash

docker image build -t content_user_module_158 .
docker image tag content_user_module_158 soberservicesguy/portfolio-images:content_user_module_158
docker image push soberservicesguy/portfolio-images:content_user_module_158
