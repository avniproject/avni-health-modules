const _ = require('lodash');

const CommonConcepts = require('../src/health_modules/commonConcepts.json');
const ChildConcepts = require('../src/health_modules/child/metadata/concepts.json');
const MotherConcepts = require('../src/health_modules/mother/metadata/motherConcepts.json');
const OPDConcepts = require('../src/health_modules/outpatient/metadata/concepts.json');

const ChildProgramEncounterForm = require('../src/health_modules/child/metadata/childDefaultProgramEncounterForm.json');
const ChildProgramEnrolmentForm = require('../src/health_modules/child/metadata/childProgramEnrolmentForm.json');
const ChildProgramExitForm = require('../src/health_modules/child/metadata/childProgramExitForm.json');
const MotherAbortionForm = require('../src/health_modules/mother/metadata/motherAbortionForm.json');
const MotherANCForm = require('../src/health_modules/mother/metadata/motherANCForm.json');
const MotherDeliveryForm = require('../src/health_modules/mother/metadata/motherDeliveryForm.json');
const MotherPNCForm = require('../src/health_modules/mother/metadata/motherPNCForm.json');
const MotherProgramEnrolmentForm = require('../src/health_modules/mother/metadata/motherProgramEnrolmentForm.json');
const MotherProgramExitForm = require('../src/health_modules/mother/metadata/motherProgramExitForm.json');
const OPDEncounterForm = require('../src/health_modules/outpatient/metadata/encounterForm.json');
import {Concept} from "avni-models";


const IMPORTED_CONCEPTS = _([CommonConcepts, ChildConcepts, MotherConcepts, OPDConcepts])
    .flatten()
    .groupBy('uuid')
    .values()
    .map(concepts => _.merge({}, concepts[0], {answers: _.flatMap(concepts, 'answers')}))
    .value();

const FORM_CONCEPTS = _.flatten(_.flatten([ChildProgramEncounterForm, ChildProgramEnrolmentForm, ChildProgramExitForm, MotherAbortionForm, MotherANCForm, MotherDeliveryForm, MotherPNCForm, MotherProgramEnrolmentForm, MotherProgramExitForm, OPDEncounterForm]
    .map((formDef) => formDef.formElementGroups.map((fegs) => fegs.formElements))));

let concepts = _.mapValues(_.groupBy(IMPORTED_CONCEPTS.concat(FORM_CONCEPTS), 'name'), (val) => val[0]);
module.exports = concepts;

module.exports.findConcept = function (conceptName) {
    let conceptData = _.find(concepts, (concept) => concept.name === conceptName);
    let concept = _.isNil(conceptData.concept) ? conceptData : conceptData.concept;
    return _.assignIn(new Concept(), concept);
};

let findConcept = function (conceptName) {
    return _.find(IMPORTED_CONCEPTS, (concept) => concept.name === conceptName);
};

let isAnswerDefinedForCodedConcept = function (conceptName, answerConceptName) {
    let codedConcept = findConcept(conceptName);
    let answerConcept = findConcept(answerConceptName);
    return _.some(codedConcept.answers, (x) => x.uuid === _.get(answerConcept,'uuid'));
};

module.exports.areAnswersDefinedForCodedConcept = function (codedConceptName, answerConceptNames) {
    return _.reduce(answerConceptNames, (found, answerConceptName) => found && isAnswerDefinedForCodedConcept(codedConceptName, answerConceptName), true);
};
