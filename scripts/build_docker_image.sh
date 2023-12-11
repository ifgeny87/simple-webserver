#!/bin/bash
set -e

# build args
DOCKERFILE=docker/Dockerfile
IMAGE_TAG=simple-webserver:latest

# paths
ROOT=$(cd "$(dirname "$0")/.." && pwd)

echo "🚀 Building docker image from \"$DOCKERFILE\" with tag \"$IMAGE_TAG\" from directory \"$ROOT\"..."

# check Dockerfile
if [[ ! -e "$DOCKERFILE" ]]; then echo "File $DOCKERFILE does no exists"; exit 1; fi

# build image
docker build \
  --tag "$IMAGE_TAG" \
  --file "$DOCKERFILE" \
  "$ROOT"
