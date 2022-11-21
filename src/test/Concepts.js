const _ = require('lodash');

const CommonConcepts = require('../health_modules/commonConcepts.json');
const ChildConcepts = require('../health_modules/child/metadata/concepts.json');
const MotherConcepts = require('../health_modules/mother/metadata/motherConcepts.json');
const OPDConcepts = require('../health_modules/outpatient/metadata/concepts.json');

const ChildProgramEncounterForm = require('../health_modules/child/metadata/childDefaultProgramEncounterForm.json');
const ChildProgramEnrolmentForm = require('../health_modules/child/metadata/childProgramEnrolmentForm.json');
const ChildProgramExitForm = require('../health_modules/child/metadata/childProgramExitForm.json');
const MotherAbortionForm = require('../health_modules/mother/metadata/motherAbortionForm.json');
const MotherANCForm = require('../health_modules/mother/metadata/motherANCForm.json');
const MotherDeliveryForm = require('../health_modules/mother/metadata/motherDeliveryForm.json');
const MotherPNCForm = require('../health_modules/mother/metadata/motherPNCForm.json');
const MotherProgramEnrolmentForm = require('../health_modules/mother/metadata/motherProgramEnrolmentForm.json');
const MotherProgramExitForm = require('../health_modules/mother/metadata/motherProgramExitForm.json');
const OPDEncounterForm = require('../health_modules/outpatient/metadata/encounterForm.json');
import {Concept, ConceptAnswer} from "openchs-models";


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
    const conceptData = _.find(concepts, (concept) => concept.name === conceptName);
    const concept = _.isNil(conceptData.concept) ? conceptData : conceptData.concept;
    const c = new Concept();
    c.uuid = concept.uuid;
    c.name = concept.name;
    c.datatype = concept.datatype;
    c.keyValues = concept.keyValues;
    c.hiAbsolute = concept.hiAbsolute;
    c.hiNormal = concept.hiNormal;
    c.lowAbsolute = concept.lowAbsolute;
    c.lowNormal = concept.lowNormal;
    c.unit = concept.unit;
    c.voided = concept.voided;
    c.answers = [];
    concept.answers.forEach((ca) => {
        if (_.isNil(ca)) return null;
        const conceptAnswer = new ConceptAnswer();
        conceptAnswer.uuid = ca.uuid;
        conceptAnswer.concept = c;
        conceptAnswer.abnormal = ca.abnormal;
        conceptAnswer.answerOrder = ca.answerOrder;
        c.answers.push(ca);
    })
    return c;
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
