build:
	gulp clean
	gulp build
ifeq ($(TRAVIS), true)
	./buildWithTravis.sh
endif