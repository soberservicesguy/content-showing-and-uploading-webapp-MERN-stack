


















#!/usr/bin/env bash

docker image build -t content_video_173 .
docker image tag content_video_173 soberservicesguy/portfolio-images:content_video_173
docker image push soberservicesguy/portfolio-images:content_video_173
