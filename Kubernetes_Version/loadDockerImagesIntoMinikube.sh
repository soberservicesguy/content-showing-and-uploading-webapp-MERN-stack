#!/usr/bin/env bash

# minikube start
echo "enabling kubernetes to access docker daemon"
echo 'running eval $(minikube docker-env)'
eval $(minikube docker-env)

echo " "
echo "running minikube image load content_blogposts"
echo " "
minikube image load content_blogposts

echo " "
echo "running minikube image load content_bulk_uploads"
echo " "
minikube image load content_bulk_uploads

echo " "
echo "running minikube image load content_frontend"
echo " "
minikube image load content_frontend

echo " "
echo "running minikube image load content_images"
echo " "
minikube image load content_images

echo " "
echo "running minikube image load content_user_module"
echo " "
minikube image load content_user_module

echo " "
echo "running minikube image load content_videos"
echo " "
minikube image load content_videos