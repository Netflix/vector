build:
	gulp clean
	gulp build
	@if [ "$TRAVIS" == "true" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then \
		docker build -t netflixoss/vector . ; \
		if [ "$TRAVIS_TAG" != "" ]; then \
			docker tag netflixoss/vector:latest netflixoss/vector:$TRAVIS_TAG; \
		fi; \
		docker images; \
		docker login -u=${dockerhubUsername} -p=${dockerhubPassword}; \
		docker push netflixoss/vector; \
	fi