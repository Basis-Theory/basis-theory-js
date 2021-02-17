MAKEFLAGS += --silent

verify:
	docker-compose pull && ./scripts/verify.sh

build:
	./scripts/build.sh	

acceptance:
	./scripts/acceptance.sh

start-docker:
	./scripts/startdocker.sh

stop-docker:
	./scripts/stopdocker.sh

release:
	yarn release