#!/usr/bin/env bash
docker image build -t content_blogposts ../Containers_Version/image_sources/blogposts
docker image build -t content_bulk_uploads ../Containers_Version/image_sources/bulk_uploads
docker image build -t content_frontend ../Containers_Version/image_sources/frontend_service
docker image build -t content_images ../Containers_Version/image_sources/images
docker image build -t content_user_module ../Containers_Version/image_sources/user_module
docker image build -t content_videos ../Containers_Version/image_sources/videos