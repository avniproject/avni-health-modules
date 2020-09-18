check-node-v:
ifneq ($(shell node -v),$(shell cat .nvmrc))
	@echo '\nPlease run `nvm use` in your terminal to change node version\n'
	@exit 1
endif
	@node -v


port:= $(if $(port),$(port),8021)
server:= $(if $(server),$(server),http://localhost)

token:=
poolId:=
clientId:=
username:=
password:=

auth:
	$(if $(password),$(eval token:=$(shell node scripts/token.js '$(server):$(port)' $(username) $(password))))

get-token: auth
	@echo
	@echo $(token)
	@echo

auth_live:
	make auth poolId=$(OPENCHS_PROD_USER_POOL_ID) clientId=$(OPENCHS_PROD_APP_CLIENT_ID) username=admin password=$(OPENCHS_PROD_ADMIN_USER_PASSWORD)
	echo $(token)

upload = \
	curl -X POST $(server):$(port)/$(1) -d $(2)  \
		-H "Content-Type: application/json"  \
		-H "USER-NAME: admin"  \
		-H "AUTH-TOKEN: $(token)"

# <rules>
build_rules: ## Create webpack files for all the rules
	python build-config/json_validation.py health_modules
	rm -f output/*.js
	./node_modules/.bin/webpack --config build-config/programEnrolmentDecisionWebpack.config.js
	./node_modules/.bin/webpack --config build-config/programEncounterDecisionWebpack.config.js
	./node_modules/.bin/webpack --config build-config/encounterDecisionWebpack.config.js
	./node_modules/.bin/webpack --config build-config/individualRegistrationDecisionWebpack.config.js
	./node_modules/.bin/webpack --config build-config/programConfigWebpack.config.js
# </rules>

# <metadata>
deploy_metadata: auth dev_deploy_metadata ## Upload metadata to server; poolId,clientId,username,password should be set if not deploying to local

dev_deploy_metadata: ## Upload metadata to server
	@echo "-----------------"
	@echo " Common metadata"
	@echo "-----------------"

	$(call upload,concepts,@health_modules/commonConcepts.json)
	@echo

	$(call upload,concepts,@health_modules/outpatient/metadata/concepts.json)
	@echo
	$(call upload,encounterTypes,@health_modules/outpatient/metadata/encounterTypes.json)
	@echo
	$(call upload,forms,@health_modules/common/metadata/defaultProgramEncounterCancellationForm.json)
	@echo
	$(call upload,forms,@health_modules/outpatient/metadata/encounterForm.json)
	@echo
	$(call upload,formMappings,@health_modules/outpatient/metadata/formMappings.json)
	@echo

	$(call upload,forms,@health_modules/common/metadata/defaultProgramExitForm.json)
	@echo

	$(call upload,concepts,@health_modules/mother/metadata/motherConcepts.json)
	@echo
	$(call upload,programs,@health_modules/mother/metadata/motherProgram.json)
	@echo
	$(call upload,encounterTypes,@health_modules/mother/metadata/encounterTypes.json)
	@echo
	$(call upload,forms,@health_modules/mother/metadata/motherProgramEnrolmentForm.json)
	@echo
	$(call upload,forms,@health_modules/mother/metadata/motherANCForm.json)
	@echo
	$(call upload,forms,@health_modules/mother/metadata/motherANCLabTestResultsForm.json)
	@echo
	$(call upload,forms,@health_modules/mother/metadata/motherDeliveryForm.json)
	@echo
	$(call upload,forms,@health_modules/mother/metadata/motherAbortionForm.json)
	@echo
	$(call upload,forms,@health_modules/mother/metadata/motherPNCForm.json)
	@echo
	$(call upload,forms,@health_modules/mother/metadata/motherProgramExitForm.json)
	@echo
	$(call upload,formMappings,@health_modules/mother/metadata/formMappings.json)
	@echo
	$(call upload,mother/config,@health_modules/mother/metadata/motherProgramConfig.json)
	@echo

	$(call upload,concepts,@health_modules/child/metadata/concepts.json)
	@echo
	$(call upload,concepts,@health_modules/child/metadata/vaccinationConcepts.json)
	@echo
	$(call upload,programs,@health_modules/child/metadata/childProgram.json)
	@echo
	$(call upload,encounterTypes,@health_modules/child/metadata/encounterTypes.json)
	@echo
	$(call upload,forms,@health_modules/child/metadata/birthForm.json)
	@echo
	$(call upload,forms,@health_modules/child/metadata/childProgramEnrolmentForm.json)
	@echo
	$(call upload,forms,@health_modules/child/metadata/childDefaultProgramEncounterForm.json)
	@echo
	$(call upload,forms,@health_modules/child/metadata/childProgramExitForm.json)
	@echo
	$(call upload,forms,@health_modules/child/metadata/anthroAssessmentForm.json)
	@echo
	$(call upload,formMappings,@health_modules/child/metadata/formMappings.json)
	@echo

	$(call upload,programs,@health_modules/adolescent/metadata/adolescentProgram.json)
	@echo
	$(call upload,concepts,@health_modules/adolescent/metadata/adolescentConcepts.json)
	@echo
	$(call upload,adolescent/config,@health_modules/adolescent/metadata/adolescentProgramConfig.json)
	@echo
	date

deploy_common_concepts_dev:
	$(call upload,concepts,@health_modules/commonConcepts.json)

deploy_referral_concepts_fix: auth
	$(call upload,concepts,@health_modules/mother/metadata/referral_concepts_fix.json)

# <Workflows related, Composite, Convenience and Conventional Actions>
deploy: deploy_metadata

deploy_demo_refdata:
	@echo "----------"
	@echo "demo"
	@echo "----------"
	cd ../demo-organisation && make deploy_refdata server=$(server) port=$(port) token=$(token)

implementations := sewa-rural lbp-arogyadoot

# <deploy-all>
deploy_all_impls: auth deploy deploy_demo_refdata ## Deploy all implementations/ create_org separately before/ optional arguments: server=https://staging.openchs.org port=443
	$(foreach impl,$(implementations),./scripts/deploy_implementation.sh $(impl) $(server) $(port) $(token);)

# </deploy-all>

deploy_common_concepts_staging:
	make auth deploy_common_concepts_dev poolId=$(OPENCHS_STAGING_USER_POOL_ID) clientId=$(OPENCHS_STAGING_APP_CLIENT_ID) server=https://staging.openchs.org port=443 username=admin password=$(password)

deploy_common_concepts_uat:
	make auth deploy_common_concepts_dev poolId=$(OPENCHS_UAT_USER_POOL_ID) clientId=$(OPENCHS_UAT_APP_CLIENT_ID) server=https://uat.openchs.org port=443 username=admin password=$(password)

deploy_common_concepts_live:
	make auth deploy_common_concepts_dev poolId=$(OPENCHS_PROD_USER_POOL_ID) clientId=$(OPENCHS_PROD_APP_CLIENT_ID) server=https://server.openchs.org port=443 username=admin password=$(password)

deploy_metadata_staging:
	make deploy poolId=$(OPENCHS_STAGING_USER_POOL_ID) clientId=$(OPENCHS_STAGING_APP_CLIENT_ID) server=https://staging.openchs.org port=443 username=admin password=$(password)

deploy_metadata_uat:
	make deploy poolId=$(OPENCHS_UAT_USER_POOL_ID) clientId=$(OPENCHS_UAT_APP_CLIENT_ID) server=https://uat.openchs.org port=443 username=admin password=$(password)

deploy_metadata_staging_local:
	make deploy poolId=$(OPENCHS_STAGING_USER_POOL_ID) clientId=$(OPENCHS_STAGING_APP_CLIENT_ID) server=http://localhost port=8021 username=admin password=$(password)

deploy_metadata_live:
	make deploy poolId=$(OPENCHS_PROD_USER_POOL_ID) clientId=$(OPENCHS_PROD_APP_CLIENT_ID) server=https://server.openchs.org port=443 username=admin password=$(password)

deploy_metadata_prerelease:
	make deploy poolId=$(OPENCHS_PRERELEASE_USER_POOL_ID) clientId=$(OPENCHS_PRERELEASE_APP_CLIENT_ID) server=https://prerelease.openchs.org port=443 username=admin password=$(password)

deploy_metadata_refdata: deploy_metadata ## Deploy common metadata and demo refdata
	cd packages/demo-organisation && make deploy

deploy_referral_concepts_fix_prod:
	make deploy_referral_concepts_fix poolId=$(OPENCHS_PROD_USER_POOL_ID) clientId=$(OPENCHS_PROD_APP_CLIENT_ID) server=https://server.openchs.org port=443 username=admin password=$(password)
# </metadata>

#server,port args need to be provided
lbp_inpremise_deploy:
	make deploy poolId=$(OPENCHS_LBP_PROD_USER_POOL_ID) clientId=$(OPENCHS_LBP_PROD_APP_CLIENT_ID) username=admin password=$(password) server=$(server) port=$(port)

clean:
	rm -rf node_modules

deps: check-node-v
	@rm -rf package-lock.json
	yarn install

test: check-node-v
	yarn test

build: check-node-v
	yarn run build

release:
	git pull --tags
	git pull --rebase
	yarn version --patch
	@echo "   Now please run \nmake publish"

publish:
	git push && git push origin --tags

