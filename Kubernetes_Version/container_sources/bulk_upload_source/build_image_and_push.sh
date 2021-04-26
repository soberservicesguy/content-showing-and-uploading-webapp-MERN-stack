


#!/usr/bin/env bash

docker image build -t content_bulk_upload_157 .
docker image tag content_bulk_upload_157 soberservicesguy/portfolio-images:content_bulk_upload_157
docker image push soberservicesguy/portfolio-images:content_bulk_upload_157
