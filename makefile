MAKEFLAGS += --silent

verify:
	./scripts/verify.sh

build:
	./scripts/build.sh

acceptance:
	./scripts/acceptance.sh

setup-infra:
	./scripts/setupinfra.sh

deploy-to-r2:
	./scripts/deploy-to-r2.sh

release:
	yarn release
	$(MAKE) setup-infra

write-lib-vars:
	./scripts/writelibvars.sh
