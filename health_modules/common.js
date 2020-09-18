import _ from 'lodash';
import moment from 'moment';
import getZScore,  {projectedSD2NegForWeight} from './child/zScoreCalculator';

function C() {

    this.addDays = function (date, numberOfDays) {
        const copied = this.copyDate(date);
        copied.setDate(copied.getDate() + numberOfDays);
        return copied;
    };

    this.addMonths = function (date, numberOfMonths) {
        return moment(date).add(numberOfMonths, 'months').toDate();
    };

    this.addWeeks = function (date, numberOfWeeks) {
        return moment(date).add(numberOfWeeks, 'weeks').toDate();
    };

    this.isBefore = function (past, present) {
        return moment(past).isBefore(present);
    };

    this.copyDate = function (date) {
        return new Date(date.getTime());
    };

    this.encounterExists = function (encounters, encounterTypeName, encounterName) {
        return encounters.some(function (encounter) {
                return encounter.encounterType.name === encounterTypeName && encounter.name === encounterName;
            }
        )
    };

    this.calculateBMI = function (weight, height) {
        return _.ceil((weight / Math.pow(height, 2)) * 10000, 1);
    };

    /* todo
     handle case to increment # of month if day of month > 20
     */
    this.getAgeInMonths = function (dateOfBirth, today) {
        today = this.copyDate(today);

        var birthDate = this.copyDate(dateOfBirth);
        var year1 = birthDate.getFullYear();
        var year2 = today.getFullYear();
        var month1 = birthDate.getMonth();
        var month2 = today.getMonth();
        if (month1 === 0) {
            month1++;
            month2++;
        }
        var numberOfMonths = (year2 - year1) * 12 + (month2 - month1);
        return (numberOfMonths);
    };

    this.getWeeks = function (lmpDate, date) {
        return (Math.round((date - lmpDate) / 604800000));
    };

    this.getDays = function (firstDate, secondDate) {
        var oneDay = 24 * 60 * 60 * 1000;
        return (Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay))));
    };

    this.getDateOfBirth = (age, fromDate = new Date()) => {
        return moment(fromDate).subtract(age, 'years').toDate();
    };


    this.getMatchingKey = function (obsValue, masterData) {
        var keys = Object.keys(masterData);
        for (var i = 0; i < keys.length; i++) {
            var currentLength = masterData[i].length;
            var nextLength = masterData[i + 1].length;
            var currentKeyDifference = Math.abs(obsValue - currentLength);
            var nextKeyDifference = Math.abs(obsValue - nextLength);
            if (nextKeyDifference < currentKeyDifference) continue;
            else return currentLength;
        }
    };

    this.contains = function (array, value) {
        if (array === undefined || array === null) return false;

        return array.some(function (arrayItem) {
            return arrayItem === value;
        });
    };

    this.decision = function (name, value, scope) {
        return {name: name, value: value};
    };

    this.findValue = function (decisions, name) {
        var matchingDecision = decisions.find(function (decision) {
            return decision.name === name;
        });
        return matchingDecision ? matchingDecision.value : null;
    };

    this.createValidationResult = function (success, messageKey) {
        return {success: false, messageKey: messageKey};
    };

    this.createValidationError = function (messageKey) {
        return this.createValidationResult(false, messageKey);
    };

    this.addChecklistItem = function (baseDate, nameOfVaccination, dueDateIncrementInDays, maxDateIncrementInDays) {
        return {
            name: nameOfVaccination,
            dueDate: this.addDays(baseDate, dueDateIncrementInDays),
            maxDate: this.addDays(baseDate, maxDateIncrementInDays)
        };
    };

    this.isNil = function (obj) {
        return obj === null || obj === undefined;
    };

    this.isEmptyOrBlank = (value) =>
        _.overSome([_.isNil, _.isNaN])(value) ? true : 
            _.overSome([_.isNumber, _.isBoolean, _.isDate])(value) ? false :
                    _.isEmpty(value); 

    this.getYoungestChild = (individual) => {
        return _.chain(individual.getRelatives('mother', true)).filter(_.isObject).sortBy('dateOfBirth').last().value();
    };

    this.getZScoreFromEncounter = (programEncounter) => {
        const weight = programEncounter.getObservationValue("Weight");
        const height = programEncounter.getObservationValue("Height");
        return getZScore(programEncounter.programEnrolment.individual, programEncounter.encounterDateTime, weight, height);
    };

    this.getZScore = (individual, asOnDate, weight, height) => {
        return getZScore(individual, asOnDate, weight, height);
    };

    this.projectedSD2NegForWeight = (individual, asOnDate) => {
        return projectedSD2NegForWeight(individual, asOnDate);
    };

    this.weeksBetween = (arg1, arg2) => {
        return moment.duration(moment(arg1).diff(moment(arg2))).asWeeks();
    }    
}

module.exports = new C();

