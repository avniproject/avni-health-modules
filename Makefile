check-node-v:
ifneq ($(shell node -v),$(shell cat .nvmrc))
	@echo '\nPlease run `nvm use` in your terminal to change node version\n'
	@exit 1
endif
	@node -v

clean:
	rm -rf node_modules

deps: check-node-v
	yarn install

build: check-node-v
	yarn run build

test: check-node-v
	yarn test

release:
	git pull --tags
	git pull --rebase
	yarn version --patch
	@echo "   Now please run \nmake publish"

publish:
	git push && git push origin --tags

