MAKEFLAGS += --silent

verify:
	./scripts/verify.sh

build:
	./scripts/build.sh

acceptance:
	./scripts/acceptance.sh

setup-infra:
	./scripts/setupinfra.sh

deploy-index-hash:
	./scripts/deploy-index-hash.sh

release:
	yarn release
	$(MAKE) setup-infra

write-lib-vars:
	./scripts/writelibvars.sh
