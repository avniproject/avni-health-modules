import {complicationsBuilder as ComplicationsBuilder} from "rules-config/rules";

const highRisk = (enrolment, encounter, today = new Date()) => {
    const highRiskBuilder = new ComplicationsBuilder({
        programEnrolment: enrolment,
        programEncounter: encounter,
        complicationsConcept: 'High Risk Conditions'
    });

    highRiskBuilder.addComplication("Child born Underweight")
        .when.valueInEncounter("Birth Weight").lessThan(2);

    highRiskBuilder.addComplication("Did not cry soon after birth")
        .when.valueInEncounter("Cried soon after birth").containsAnswerConceptName("No");

    highRiskBuilder.addComplication("Not Breast-fed within 1 hour of birth")
        .when.valueInEncounter("Breast feeding within 1 hour of birth").containsAnswerConceptName("No");

    highRiskBuilder.addComplication("Colour of child is Pale or Blue")
        .when.valueInEncounter("Colour of child").containsAnswerConceptName("Blue/pale")

    highRiskBuilder.addComplication("Reflex Absent")
        .when.valueInEncounter("Reflex").containsAnswerConceptName("Absent");

    highRiskBuilder.addComplication("Muscle tone Absent/Flexed arms and legs")
        .when.valueInEncounter("Muscle tone").containsAnyAnswerConceptName("Absent", "Flexed arms and legs");

    highRiskBuilder.addComplication("Low Pulse")
        .when.valueInEncounter("Child Pulse").lessThan(60);

    highRiskBuilder.addComplication("High Pulse")
        .when.valueInEncounter("Child Pulse").greaterThan(100);

    highRiskBuilder.addComplication("Low Temperature")
        .when.valueInEncounter("Child Temperature").lessThan(97.5);

    highRiskBuilder.addComplication("High Temperature")
        .when.valueInEncounter("Child Temperature").greaterThan(99.5);

    highRiskBuilder.addComplication("Low Respiratory Rate")
        .when.valueInEncounter("Child Respiratory Rate").lessThan(30);

    highRiskBuilder.addComplication("High Respiratory Rate")
        .when.valueInEncounter("Child Respiratory Rate").greaterThan(60);

    highRiskBuilder.addComplication("Icterus present")
        .when.valueInEncounter("Jaundice (Icterus)").containsAnswerConceptName("Present");

    return highRiskBuilder.getComplications()
};

const generateHighRiskConditionAdvice = (enrolment, encounter, today = new Date()) => {
    return highRisk(enrolment, encounter, today = new Date());
};

const getHighRiskConditionsInEnrolment = (enrolment) => {
    const highRiskBuilder = new ComplicationsBuilder({
        programEnrolment: enrolment,
        complicationsConcept: 'High Risk Conditions'
    });

    return highRiskBuilder.getComplications();
};

export {generateHighRiskConditionAdvice as default, getHighRiskConditionsInEnrolment};