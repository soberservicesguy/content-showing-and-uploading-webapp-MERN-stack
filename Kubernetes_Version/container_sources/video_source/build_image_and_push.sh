















#!/usr/bin/env bash

docker image build -t content_video_170 .
docker image tag content_video_170 soberservicesguy/portfolio-images:content_video_170
docker image push soberservicesguy/portfolio-images:content_video_170
