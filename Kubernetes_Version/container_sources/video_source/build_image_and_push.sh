

#!/usr/bin/env bash

docker image build -t content_video_156 .
docker image tag content_video_156 soberservicesguy/portfolio-images:content_video_156
docker image push soberservicesguy/portfolio-images:content_video_156
