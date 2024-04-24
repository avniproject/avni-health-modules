import {assert} from "chai";
import zScore, {projectedSD2NegForWeight} from "../../health_modules/child/zScoreCalculator";
import {Gender, Individual} from 'avni-models';
import moment from "moment";

describe("zScoreCalculator", () => {
    describe("zScore()", () => {
        let individual, male, female;

        beforeEach(() => {
            male = new Gender();
            male.name = 'Male';

            female = new Gender();
            female.name = 'Female';

            individual = Individual.newInstance("2425e7ce-5872-42c0-b3f2-95a134830478", "Raman", "Singh", moment().toDate(), true, male, 1);
        });

        it("calculates z-scores for an individual", () => {
            let today = new Date();
            individual.dateOfBirth = moment(today).subtract(1, 'month');
            let zScores = zScore(individual, today, 4.5, 54.7);
            assert.hasAllKeys(zScores, ['wfa', 'hfa', 'wfh']);
        });

        it("calculates weight for age z-scores for boys and girls between 0 and 5", () => {
            const today = new Date();
            individual.dateOfBirth = moment(today).subtract(1, 'month');

            // check for numbers outside -3 and 3
            assert.equal(zScore(individual, today, 1.2).wfa, -6.78);
            assert.equal(zScore(individual, today, 4.5).wfa, 0.05);
            assert.equal(zScore(individual, today, 5.1).wfa, 1);

            individual.dateOfBirth = moment(today).subtract(26, 'month');
            assert.equal(zScore(individual, today, 7.0).wfa, -4.75);

            individual.dateOfBirth = moment(today).subtract(26, 'month');
            assert.equal(zScore(individual, today, 6.3).wfa, -5.4);

            individual.dateOfBirth = moment(today).subtract(13, 'month');
            assert.equal(zScore(individual, today, 25).wfa, 11.1);

            individual.gender = female;

            individual.dateOfBirth = moment(today).subtract(19, 'month');
            assert.equal(zScore(individual, today, 63).wfa, 27.57);

            individual.dateOfBirth = moment(today).subtract(1, 'month');
            assert.equal(zScore(individual, today, 2.7).wfa, -3.08);

            //Notice this calculation may not exactly match the zscores as provided in the reference
            assert.equal(zScore(individual, today, 3.2).wfa, -1.91);
            assert.equal(zScore(individual, today, 4.2).wfa, 0.02);
            assert.equal(zScore(individual, today, 4.8).wfa, 1.01);
            assert.equal(zScore(individual, today, 5.5).wfa, 2.03);
            assert.equal(zScore(individual, today, 6.2).wfa, 2.96);

            //2 year old girl
            individual.dateOfBirth = moment(today).subtract(24, 'month');

            assert.equal(zScore(individual, today, 8.1,).wfa, -2.96);
            assert.equal(zScore(individual, today, 9).wfa, -2.03);
            assert.equal(zScore(individual, today, 10.2).wfa, -0.97);
            assert.equal(zScore(individual, today, 11.5).wfa, 0.02);
            assert.equal(zScore(individual, today, 13).wfa, 0.99);
            assert.equal(zScore(individual, today, 14.8).wfa, 1.98);
            assert.equal(zScore(individual, today, 17).wfa, 2.99);

            //5 year old girl
            individual.dateOfBirth = moment(today).subtract(60, 'month');

            assert.equal(zScore(individual, today, 12.1).wfa, -2.97);
            assert.equal(zScore(individual, today, 13.7).wfa, -2.02);
            assert.equal(zScore(individual, today, 15.8).wfa, -0.99);
            assert.equal(zScore(individual, today, 18.2).wfa, -0.01);
            assert.equal(zScore(individual, today, 21.2).wfa, 1);
            assert.equal(zScore(individual, today, 24.9).wfa, 2);
            assert.equal(zScore(individual, today, 29.5).wfa, 2.99);

            //3 year old boy
            individual.dateOfBirth = moment(today).subtract(36, 'month');
            individual.gender = male;

            assert.equal(zScore(individual, today, 10).wfa, -3.01);
            assert.equal(zScore(individual, today, 11.3).wfa, -1.98);
            assert.equal(zScore(individual, today, 12.7).wfa, -1.01);
            assert.equal(zScore(individual, today, 14.3).wfa, -0.02);
            assert.equal(zScore(individual, today, 16.2).wfa, 1);
            assert.equal(zScore(individual, today, 18.3).wfa, 1.99);
            assert.equal(zScore(individual, today, 20.7).wfa, 2.99);
        });

        it("calculates height for age z-scores for boys and girls between 0 and 5", () => {
            let today = new Date();
            individual.dateOfBirth = moment(today).subtract(26, 'months').toDate();
            individual.gender = female;
            assert.equal(zScore(individual, today, 0, 77.5).hfa, -2.99);
            assert.equal(zScore(individual, today, 0, 80.8).hfa, -2);
            assert.equal(zScore(individual, today, 0, 84.1).hfa, -1);
            assert.equal(zScore(individual, today, 0, 87.4).hfa, -0.01);
            assert.equal(zScore(individual, today, 0, 90.8).hfa, 1.01);
            assert.equal(zScore(individual, today, 0, 94.1).hfa, 2);
            assert.equal(zScore(individual, today, 0, 97.4).hfa, 2.99);

            individual.gender = male;
            individual.dateOfBirth = moment(today).subtract(13, 'months').toDate();

            assert.equal(zScore(individual, today, 0, 69.6).hfa, -3.02);
            assert.equal(zScore(individual, today, 0, 72.1).hfa, -1.99);
            assert.equal(zScore(individual, today, 0, 74.5).hfa, -1);
            assert.equal(zScore(individual, today, 0, 76.9).hfa, -0.01);
            assert.equal(zScore(individual, today, 0, 79.3).hfa, 0.98);
            assert.equal(zScore(individual, today, 0, 81.2).hfa, 1.76);
            assert.equal(zScore(individual, today, 0, 81.8).hfa, 2.01);
            assert.equal(zScore(individual, today, 0, 84.2).hfa, 3);
        });

        it("calculates weight for height z-scores for boys between 0 and 5", () => {
            let today = new Date();
            individual.dateOfBirth = moment(today).subtract(23, 'months').toDate();
            individual.gender = male;
            assert.isUndefined(zScore(individual, today, 10, 40.0).wfh);
            assert.equal(zScore(individual, today, 6.4, 68.5).wfh, -2.96);
            assert.equal(zScore(individual, today, 6.9, 68.5).wfh, -1.98);
            assert.equal(zScore(individual, today, 7.5, 68.5).wfh, -0.92);
            assert.equal(zScore(individual, today, 8.1, 68.5).wfh, 0.03);
            assert.equal(zScore(individual, today, 8.8, 68.5).wfh, 1.02);
            assert.equal(zScore(individual, today, 9.6, 68.5).wfh, 2.03);
            assert.equal(zScore(individual, today, 10.5, 68.5).wfh, 3.04);

            individual.dateOfBirth = moment(today).subtract(35, 'months').toDate();
            assert.isUndefined(zScore(individual, today, 10, 50.0).wfh);
            assert.equal(zScore(individual, today, 6.5, 68.5).wfh, -3.01);
            assert.equal(zScore(individual, today, 7.0, 68.5).wfh, -2.04);
            assert.equal(zScore(individual, today, 7.6, 68.5).wfh, -1);
            assert.equal(zScore(individual, today, 8.2, 68.5).wfh, -0.06);
            assert.equal(zScore(individual, today, 9.0, 68.5).wfh, 1.06);
            assert.equal(zScore(individual, today, 9.8, 68.5).wfh, 2.04);
            assert.equal(zScore(individual, today, 10.7, 68.5).wfh, 3.03);
        });

        it("calculates weight for height z-scores for girls between 0 and 5", () => {
            let today = new Date();
            individual.dateOfBirth = moment(today).subtract(23, 'months').toDate();
            individual.gender = female;


            assert.equal(zScore(individual, today, 5.8, 67.0).wfh, -3.01);
            assert.equal(zScore(individual, today, 6.3, 67.0).wfh, -2.03);
            assert.equal(zScore(individual, today, 6.9, 67.0).wfh, -0.97);
            assert.equal(zScore(individual, today, 7.5, 67.0).wfh, -0.04);
            assert.equal(zScore(individual, today, 8.3, 67.0).wfh, 1.05);
            assert.equal(zScore(individual, today, 9.1, 67.0).wfh, 2.01);
            assert.equal(zScore(individual, today, 10.0, 67.0).wfh, 2.96);

            individual.dateOfBirth = moment(today).subtract(35, 'months').toDate();
            assert.equal(zScore(individual, today, 6.2, 68.5).wfh, -2.95);
            assert.equal(zScore(individual, today, 6.7, 68.5).wfh, -2.02);
            assert.equal(zScore(individual, today, 7.3, 68.5).wfh, -1.02);
            assert.equal(zScore(individual, today, 8, 68.5).wfh, 0);
            assert.equal(zScore(individual, today, 8.8, 68.5).wfh, 1.03);
            assert.equal(zScore(individual, today, 9.7, 68.5).wfh, 2.05);
            assert.equal(zScore(individual, today, 10.7, 68.5).wfh, 3.03);
        });

        it("does not calculate weight for age or weight for height if weight does not exist or is 0", () => {
            let today = new Date();
            individual.dateOfBirth = moment(today).subtract(23, 'months').toDate();
            individual.gender = male;
            assert.isUndefined(zScore(individual, today, 0, 68.5).wfh);
            assert.isUndefined(zScore(individual, today, 0, 68.5).wfa);
            assert.isDefined(zScore(individual, today, 0, 68.5).hfa);

            assert.isUndefined(zScore(individual, today, undefined, 68.5).wfh);
            assert.isUndefined(zScore(individual, today, undefined, 68.5).wfa);
            assert.isDefined(zScore(individual, today, undefined, 68.5).hfa);

            assert.isUndefined(zScore(individual, today, null, 68.5).wfh);
            assert.isUndefined(zScore(individual, today, null, 68.5).wfa);
            assert.isDefined(zScore(individual, today, null, 68.5).hfa);
        });

        it("does not calculate height for age if height does not exist or is 0", () => {
            let today = new Date();
            individual.dateOfBirth = moment(today).subtract(23, 'months').toDate();
            individual.gender = male;

            assert.isDefined(zScore(individual, today, 8, 0).wfa);
            assert.isUndefined(zScore(individual, today, 8, 0).hfa);
            assert.isUndefined(zScore(individual, today, 8, 0).wfh);

            assert.isDefined(zScore(individual, today, 8, undefined).wfa);
            assert.isUndefined(zScore(individual, today, 8, undefined).hfa);
            assert.isUndefined(zScore(individual, today, 8, undefined).wfh);

            assert.isDefined(zScore(individual, today, 8, null).wfa);
            assert.isUndefined(zScore(individual, today, 8, null).hfa);
            assert.isUndefined(zScore(individual, today, 8, null).wfh);
        });

        it("calculates projected SD2Neg for weight", () => {
            let encounterDate = new Date(2018, 9, 10);
            individual.dateOfBirth = moment(encounterDate).subtract(6, "months").subtract(8, "days").toDate();
            let actual = projectedSD2NegForWeight(individual, encounterDate);
            assert.approximately(actual, 6.47, 0.01);
        });
    });
});
