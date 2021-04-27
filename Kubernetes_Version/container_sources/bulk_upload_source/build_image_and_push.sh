





#!/usr/bin/env bash

docker image build -t content_bulk_upload_160 .
docker image tag content_bulk_upload_160 soberservicesguy/portfolio-images:content_bulk_upload_160
docker image push soberservicesguy/portfolio-images:content_bulk_upload_160
