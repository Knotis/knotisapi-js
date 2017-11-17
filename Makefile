.PHONY: test integration configure commit-environment

configure:
	@bash ./scripts/configure.sh

commit-environment:
	@bash ./scripts/commit-environment.sh

test:
	@bash ./scripts/test.sh

integration:
	@bash ./scripts/integration.sh
