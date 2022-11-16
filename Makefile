# <makefile>
# Objects: metadata, package, env (code platform), rules
# Actions: clean, build, deploy, test
help:
	@IFS=$$'\n' ; \
	help_lines=(`fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//'`); \
	for help_line in $${help_lines[@]}; do \
	    IFS=$$'#' ; \
	    help_split=($$help_line) ; \
	    help_command=`echo $${help_split[0]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
	    help_info=`echo $${help_split[2]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
	    printf "%-30s %s\n" $$help_command $$help_info ; \
	done
# </makefile>

define _deploy
	rm -rf $1/*
	mkdir $1/dist
	cp -r dist/* $1/dist/
	cp ./* $1/
endef

set_node_version:
	. ${NVM_DIR}/nvm.sh && nvm use

clean:
	rm -rf node_modules

deps: set_node_version
	yarn install

build: set_node_version
	yarn run build

tests: set_node_version build
	yarn test

release:
	git pull --tags
	git pull --rebase
	yarn version --patch
	@echo "   Now please run \nmake publish"

publish:
	git push && git push origin --tags

deploy-local:
ifeq ($(local),)
	@echo -e '\nPlease provide the local location of node modules where to install. e.g. local=../avni-web-app/ or local=../avni-client/packages/openchs-android \n'
	@exit 1
endif
	$(call _deploy,$(local)/node_modules/avni-health-modules/dist)
