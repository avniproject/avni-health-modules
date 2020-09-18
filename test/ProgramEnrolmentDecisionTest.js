const expect = require('chai').expect;

describe('ProgramEncounterDecisionTest', function() {
    it('wiring', function() {
        const imports = require('../src/health_modules/programEnrolmentDecision');
        expect(imports.getNextScheduledVisits).is.not.undefined;
        expect(imports.getChecklists).is.not.undefined;
    });
});
