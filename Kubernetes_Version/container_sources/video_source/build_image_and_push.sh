




#!/usr/bin/env bash

docker image build -t content_video_159 .
docker image tag content_video_159 soberservicesguy/portfolio-images:content_video_159
docker image push soberservicesguy/portfolio-images:content_video_159
