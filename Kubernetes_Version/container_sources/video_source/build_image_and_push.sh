
#!/usr/bin/env bash

docker image build -t content_video_155 .
docker image tag content_video_155 soberservicesguy/portfolio-images:content_video_155
docker image push soberservicesguy/portfolio-images:content_video_155
