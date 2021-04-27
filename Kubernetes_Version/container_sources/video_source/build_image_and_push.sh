





#!/usr/bin/env bash

docker image build -t content_video_160 .
docker image tag content_video_160 soberservicesguy/portfolio-images:content_video_160
docker image push soberservicesguy/portfolio-images:content_video_160
