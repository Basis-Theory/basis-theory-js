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
	if grep -q '^VERSION=' .env; then $(MAKE) setup-infra; else echo 'No new version released; skipping CDN upload'; fi

write-lib-vars:
	./scripts/writelibvars.sh
