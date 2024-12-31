'use strict';
const x = ({params, imports}) => {
    const ancOverDueThreshold = new Map([
        [1, 150],
        [2, 210],
        [3, 240],
        [4, 255],
        [5, 270]
    ]);
    const allVisitNumbers = imports.lodash.range(1, 8);
    const currentDate = new Date();

    function hasOverdueEncounters(singleEnrolmentEncounters) {
        const baseDate = getBaseDate(singleEnrolmentEncounters[0].programEnrolment);
        const presentEncounterNumbers = singleEnrolmentEncounters.map(encounter => encounter.getObservationValue('ANC Visit Number'));
        for (const missingVisitNumbers of imports.lodash.difference(allVisitNumbers, presentEncounterNumbers)) {
            const dueDate = imports.moment(baseDate).add(ancOverDueThreshold.get(missingVisitNumbers), 'days');
            if (dueDate.isBefore(currentDate)) {
                return true;
            }
        }
        return false;
    }

    function getBaseDate(enl) {
        return enl.getObservationValue('Last menstrual period');
    }

    // note in MLD we will be using the sequence number of the encounter to determine the latest encounter. So encounterDateTime desc will be replaced over there
    // Q: we can filter out enrolments which are older than 1.5 years
    const encounters = params.db.objects('ProgramEncounter')
        .filtered(`voided == false 
                    AND encounterType.name == 'ANC - Saheli'
                    AND voided == false 
                    AND programEnrolment.individual.voided == false 
                    AND programEnrolment.voided == false 
                    AND programEnrolment.programExitDateTime == null
                    AND programEnrolment.enrolmentDateTime > AND programEnrolment.enrolmentDateTime > ${imports.moment(currentDate).subtract(1.5, 'years').toISOString()}
                    AND subquery(encounters, $encounter, 
                                    $encounter.encounterType.name == 'ANC - Saheli' 
                                    AND $encounter.voided == false).@count != 7`);
    const groupedEncounters = imports.lodash.groupBy(encounters, 'programEnrolment.uuid');
    return Object.keys(groupedEncounters)
        .filter(enrolmentUuid => hasOverdueEncounters(groupedEncounters[enrolmentUuid]))
        .map(enrolmentUuid => groupedEncounters[enrolmentUuid][0].programEnrolment.individual);
};
