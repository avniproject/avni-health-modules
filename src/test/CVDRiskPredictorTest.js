const expect = require('chai').expect;
const assert = require('chai').assert;
const riskPredictor = require('../health_modules/ncd/cvdRiskPredictor');
const ProgramEncounter = require("./Entities").ProgramEncounter;
const Individual = require("./Entities").Individual;
const ProgramEnrolment = require("./Entities").ProgramEnrolment;
const C = require('../health_modules/common');
import {Gender} from 'avni-models';

describe('Make Decision', function () {
    let programEncounter;
    let referenceDate;

    beforeEach(function () {
        programEncounter = new ProgramEncounter();
        programEncounter.programEnrolment = new ProgramEnrolment();
        programEncounter.programEnrolment.individual = new Individual();
        programEncounter.individual.setAge(55, true);
        programEncounter.setObservation("Smoking (Current or in last one year)", "Yes");
        programEncounter.setObservation("Systolic", 150);
    });

    it('Check for diabetes case and female', function () {
        programEncounter.setObservation("Suffering from diabetes", "Yes");
        programEncounter.individual.gender = Gender.create("Female");
        const decision = riskPredictor.getCvdRisk(programEncounter);
        assert.equal('Moderate',decision.riskClassification);
        assert.equal('10 to <20%',decision.riskPercentage);
        assert.equal(2, decision.risklevel);
        assert.equal(50, decision.ageGroup);
    });

    it('Check for diabetes case and male', function () {
        programEncounter.setObservation("Suffering from diabetes", "Yes");
        programEncounter.individual.gender = Gender.create("Male");
        const decision = riskPredictor.getCvdRisk(programEncounter);
        assert.equal(2, decision.risklevel);
        assert.equal(50, decision.ageGroup);
    });

    it('Check for non-diabetes and female', function () {
        programEncounter.setObservation("Suffering from diabetes", "No");
        programEncounter.individual.gender = Gender.create("Female");
        const decision = riskPredictor.getCvdRisk(programEncounter);
        assert.equal(2, decision.risklevel);
        assert.equal(50, decision.ageGroup);
    });
});

