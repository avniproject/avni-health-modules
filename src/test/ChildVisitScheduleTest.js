var assert = require('chai').assert;
var getchildVisitSchedule = require('../health_modules/child/childVisitSchedule');
const ProgramEnrolment = require("./Entities").ProgramEnrolment;
const ProgramEncounter = require("./Entities").ProgramEncounter;

describe('Create PNC Visit Schedule for Child', function () {
    var progEnrolment = new ProgramEnrolment('Child', [new ProgramEncounter('PNC 1', new Date(2017, 0, 4))]);
    progEnrolment.individual.dateOfBirth = new Date(2017, 0, 3);

    it('Decide next visit details', function(){
        progEnrolment.encounters.push(new ProgramEncounter('PNC', undefined, 'PNC 2'));
        var nextVisit = getchildVisitSchedule.getNextScheduledVisits(progEnrolment);
        assert.equal(nextVisit.name, 'PNC 3');
        assert.isTrue(matchDate(nextVisit.earliestDate, new Date(2017, 0, 10)));
    });

    var matchDate = function (date1, date2) {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    };

    it('Dont create next visit incase all visits are done', function(){
        progEnrolment.encounters.push(new ProgramEncounter('PNC', undefined, 'PNC 4'));
        var nextVisit = getchildVisitSchedule.getNextScheduledVisits(progEnrolment);
        assert.equal(nextVisit, null);
    });
});


