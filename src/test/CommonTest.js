import C from "../health_modules/common";
import {assert, expect} from "chai";
import TestHelper from './TestHelper';
import {Gender, Individual} from 'avni-models';


const checkForInvalidDate = (dateValue) =>{
    return TestHelper.checkForInvalidDate(dateValue);
};

describe('CommonTest', () => {
    let individual, male, female;

    beforeEach(() => {
        male = new Gender();
        male.name = 'Male';

        female = new Gender();
        female.name = 'Female';

        individual = Individual.newInstance("2425e7ce-5872-42c0-b3f2-95a134830478", "Raman", "Singh", '05/15/2024', true, male, 1);
    });


    it('addDays', () => {
        var date = new Date();
        var copiedDate = C.copyDate(date);
        expect(copiedDate.getYear()).is.equal(date.getYear());
        var newDate = C.addDays(date, 0);
        expect(newDate.getYear()).is.equal(date.getYear());
        expect(newDate.getMonth()).is.equal(date.getMonth());
        expect(newDate.getDay()).is.equal(date.getDay());
    });

    it('show BMI in 1 decimal precision', () => {
        const bmi = C.calculateBMI(35, 160);
        assert.equal(bmi, 13.7);
    });
    it('show BMI in 3 decimal precision if precision pass as parameter', () => {
        const bmi = C.calculateBMI(35, 160,3);
        assert.equal(bmi, 13.672);
    });

    it('isEmptyOrBlank should correctly identify empty values', () => {
        expect(C.isEmptyOrBlank()).to.be.true; 
        expect(C.isEmptyOrBlank({})).to.be.true; 
        expect(C.isEmptyOrBlank([])).to.be.true; 
        expect(C.isEmptyOrBlank("")).to.be.true;
        expect(C.isEmptyOrBlank(new String(""))).to.be.true; 
        expect(C.isEmptyOrBlank(null)).to.be.true; 
        expect(C.isEmptyOrBlank(NaN)).to.be.true; 
        expect(C.isEmptyOrBlank(0)).to.be.false;
        expect(C.isEmptyOrBlank("abc")).to.be.false; 
        expect(C.isEmptyOrBlank(false)).to.be.false; 
        expect(C.isEmptyOrBlank(true)).to.be.false; 
    });

    it("is date invalid", () => {
        const undefinedDate = undefined;
        expect(checkForInvalidDate()).to.be.an('boolean').with.eq(true);
        expect(checkForInvalidDate(undefinedDate)).to.be.an('boolean').with.eq(true);
        expect(checkForInvalidDate('is not valid')).to.be.an('boolean').with.eq(true);
        expect(checkForInvalidDate('2023-02-31T06:51:48.929Z')).to.be.an('boolean').with.eq(true);
    });

    it("is date valid", () => {
        const date = new Date();
        expect(checkForInvalidDate(date)).to.be.an('boolean').with.eq(false);
        expect(checkForInvalidDate('2023-08-21T06:51:48.929Z')).to.be.an('boolean').with.eq(false);
        expect(checkForInvalidDate('2023-08-21 06:51:48')).to.be.an('boolean').with.eq(false);
        expect(checkForInvalidDate('2023-08-21')).to.be.an('boolean').with.eq(false);
    });
    it("Should calculate the growth status for the boys", () => {
        assert.deepStrictEqual(C.calculateGrowthStatusForAdolescent({individual, weight:44, height:179, asOnDate:new Date('01/01/2040')}), {zScore: -3});
        assert.deepStrictEqual(C.calculateGrowthStatusForAdolescent({individual,weight:49,height:179, asOnDate:'01/01/2040'}), {zScore: -2});
        assert.deepStrictEqual(C.calculateGrowthStatusForAdolescent({individual,weight:48,height:170, asOnDate:'01/01/2040'}), {zScore: -1});
        assert.deepStrictEqual(C.calculateGrowthStatusForAdolescent({individual,weight:54.5,height:170, asOnDate:'01/01/2040'}), {zScore: 0});
        assert.deepStrictEqual(C.calculateGrowthStatusForAdolescent({individual,weight:51,height:150, asOnDate:'01/01/2040'}), {zScore: 1});
        assert.deepStrictEqual(C.calculateGrowthStatusForAdolescent({individual,weight:55,height:150, asOnDate:'01/01/2040'}), {zScore: 2});
        assert.deepStrictEqual(C.calculateGrowthStatusForAdolescent({individual,weight:65,height:150, asOnDate:'01/01/2040'}), {zScore: 3});
        assert.deepStrictEqual(C.calculateGrowthStatusForAdolescent({individual,weight:80,height:150, asOnDate:'01/01/2040'}), {zScore: 3});
    })
});