import {complicationsBuilder as ComplicationsBuilder} from "rules-config/rules";
import _ from "lodash";

const getImmediateReferrals = (enrolment, encounter, today) => {
    const referralAdvice = new ComplicationsBuilder({
        programEnrolment: enrolment,
        programEncounter: encounter,
        complicationsConcept: 'Refer to the hospital immediately for'
    });

    if (_.isEmpty(encounter)) return referralAdvice.getComplications();

    referralAdvice.addComplication("Abdominal pain")
        .when.valueInEncounter("Post abortion complaints").containsAnswerConceptName("Abdominal pain");

    referralAdvice.addComplication("Per vaginal bleeding")
        .when.valueInEncounter("Post abortion complaints").containsAnswerConceptName("Per vaginal bleeding");

    referralAdvice.addComplication("Fever")
        .when.valueInEncounter("Post abortion complaints").containsAnswerConceptName("Fever")
        .and.valueInEncounter("Place of abortion").containsAnswerConceptName("Home");

    referralAdvice.addComplication("Induced abortion")
        .when.valueInEncounter("Post abortion complaints").containsAnswerConceptName("Per vaginal bleeding")
        .and.when.valueInEncounter("Type of Abortion").containsAnswerConceptName("Induced abortion");

    referralAdvice.addComplication("Spontaneous abortion")
        .when.valueInEncounter("Type of Abortion").containsAnswerConceptName("Spontaneous abortion");

    return referralAdvice.getComplications();
};

const getDecisions = (programEncounter, today = new Date()) => {
    const decisions = { encounterDecisions: [], enrolmentDecisions: [] };
    const immediateReferrals = getImmediateReferrals(programEncounter.programEnrolment, programEncounter, today);
    decisions.encounterDecisions = _.isEmpty(immediateReferrals.value) ? [] : [immediateReferrals];
    return decisions;
};

export { getDecisions };