import {assert} from "chai";
import calculateGrowthStatus from "/src/health_modules/adolescent/growthStatusCalculator";
import {Gender, Individual} from 'avni-models';


describe("calculateGrowthStatus()", () => {
    let individualMale, individualFemale, male, female;
    beforeEach(() => {
        male = new Gender();
        male.name = 'Male';

        female = new Gender();
        female.name = 'Female';

        individualMale = Individual.newInstance("8f1c4bb3-76c6-47dd-990b-cc2c1b84e43f", "Rahul", "Singh", '05/15/2024', true, male, 1);
        individualFemale = Individual.newInstance("e2ee4bc3-03b9-41c3-a26f-614afbfddcf3", "Rani", "Singh", '05/15/2024', true, female, 1);
    });


    it("Should calculate the growth status for the boys", () => {
        assert.deepStrictEqual(calculateGrowthStatus(individualMale, 10, new Date('01/01/2040')), {wfaStatus: -3});
        assert.deepStrictEqual(calculateGrowthStatus(individualMale, 16, '01/01/2040'), {wfaStatus: -2});
        assert.deepStrictEqual(calculateGrowthStatus(individualMale, 17, '01/01/2040'), {wfaStatus: -1});
        assert.deepStrictEqual(calculateGrowthStatus(individualMale, 19, new Date('01/01/2040')), {wfaStatus: 0});
        assert.deepStrictEqual(calculateGrowthStatus(individualMale, 22.831, '01/01/2040'), {wfaStatus: 1});
        assert.deepStrictEqual(calculateGrowthStatus(individualMale, 26, '01/01/2040'), {wfaStatus: 2});
        assert.deepStrictEqual(calculateGrowthStatus(individualMale, 36, '01/01/2040'), {wfaStatus: 3});
    })
    it("Should calculate the growth status for the girls", () => {
        assert.deepStrictEqual(calculateGrowthStatus(individualFemale, 10, '05/15/2041'), {wfaStatus: -3});
        assert.deepStrictEqual(calculateGrowthStatus(individualFemale, 15, '05/15/2041'), {wfaStatus: -2});
        assert.deepStrictEqual(calculateGrowthStatus(individualFemale, 18.410, '05/15/2041'), {wfaStatus: -1});
        assert.deepStrictEqual(calculateGrowthStatus(individualFemale, 21, '05/15/2041'), {wfaStatus: 0});
        assert.deepStrictEqual(calculateGrowthStatus(individualFemale, 23.5, '05/15/2041'), {wfaStatus: 1});
        assert.deepStrictEqual(calculateGrowthStatus(individualFemale, 27, '05/15/2041'), {wfaStatus: 2});
        assert.deepStrictEqual(calculateGrowthStatus(individualFemale, 36.7, '05/15/2041'), {wfaStatus: 3});
    })

})

