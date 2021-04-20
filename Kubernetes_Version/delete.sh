#!/usr/bin/env bash
kubectl delete -f mongodb-depl-serv.yaml
kubectl delete -f frontend-depl-serv.yaml
kubectl delete -f image-depl-serv.yaml
kubectl delete -f blogpost-depl-serv.yaml
kubectl delete -f bulk-upload-depl-serv.yaml
kubectl delete -f users-module-depl-serv.yaml
kubectl delete -f video-depl-serv.yaml
kubectl delete -f ingress.yaml