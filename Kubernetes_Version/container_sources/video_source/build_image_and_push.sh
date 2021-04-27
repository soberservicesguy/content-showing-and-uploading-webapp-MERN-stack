






#!/usr/bin/env bash

docker image build -t content_video_161 .
docker image tag content_video_161 soberservicesguy/portfolio-images:content_video_161
docker image push soberservicesguy/portfolio-images:content_video_161
