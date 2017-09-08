#!/bin/sh

pip install --user awscli
export PATH=$PATH:$HOME/.local/bin
eval $(aws ecr get-login --region $AWS_REGION)

if [ "$TRAVIS_BRANCH" = "master" ]; then
    TAG="latest"
else
    TAG="$TRAVIS_BRANCH"
fi

docker build -t $CONTAINER_NAME:$TAG .
docker tag $CONTAINER_NAME:$TAG $CONTAINER_REGISTRY_URL:$TAG
docker push $CONTAINER_REGISTRY_URL:$TAG
