test:
	gulp test

build:
	gulp clean
	gulp build
ifeq ($(TRAVIS), true)
	./buildWithTravis.sh
endif
