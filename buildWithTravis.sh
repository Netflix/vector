#!/bin/bash

if [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_TAG" != "" ]; then
    docker build -t netflixoss/vector .
    docker tag netflixoss/vector:latest netflixoss/vector:$TRAVIS_TAG
    docker images
    docker login -u=${dockerhubUsername} -p=${dockerhubPassword}
    docker push netflixoss/vector
fi