'use strict';
const x = ({params, imports}) => {
    let ancSchedule = [150, 210, 240, 255, 270];
    let currentDate = new Date();

    function checkPeriod(enc, periodStart, periodEnd) {
        return enc.encounterDateTime > periodEnd || enc.encounterDateTime < periodStart;
    }

    function encounterHasDueEncounter(enrolmentDate, enc) {
        // Cache daysSinceEnrolment calculation
        let daysSinceEnrolment = Math.floor((currentDate - enrolmentDate) / (24 * 60 * 60 * 1000));

        // Cache milliseconds per day calculation
        const msPerDay = 24 * 60 * 60 * 1000;

        // First period check with early return
        if (daysSinceEnrolment < ancSchedule[0]) {
            return enc.encounterDateTime ?
                enc.encounterDateTime >= new Date(enrolmentDate.getTime() + ancSchedule[0] * msPerDay) :
                true;
        }

        // Pre-calculate period boundaries if needed for subsequent checks
        let periodStart, periodEnd;

        // Use if-else instead of multiple if statements for better performance
        if (daysSinceEnrolment <= ancSchedule[1]) {
            periodStart = new Date(enrolmentDate.getTime() + ancSchedule[0] * msPerDay);
            periodEnd = new Date(enrolmentDate.getTime() + ancSchedule[1] * msPerDay);
        } else if (daysSinceEnrolment <= ancSchedule[2]) {
            periodStart = new Date(enrolmentDate.getTime() + ancSchedule[1] * msPerDay);
            periodEnd = new Date(enrolmentDate.getTime() + ancSchedule[2] * msPerDay);
        } else if (daysSinceEnrolment <= ancSchedule[3]) {
            periodStart = new Date(enrolmentDate.getTime() + ancSchedule[2] * msPerDay);
            periodEnd = new Date(enrolmentDate.getTime() + ancSchedule[3] * msPerDay);
        } else if (daysSinceEnrolment <= ancSchedule[4]) {
            periodStart = new Date(enrolmentDate.getTime() + ancSchedule[3] * msPerDay);
            periodEnd = new Date(enrolmentDate.getTime() + ancSchedule[4] * msPerDay);
        } else {
            return false;
        }

        return checkPeriod(enc, periodStart, periodEnd);
    }

    function getEnrolmentDate(enl) {
        return enl.getObservationValue('Last menstrual period');
    }

    function enrolmentHasDueEncounter(enl) {
        // Early return if enrollment is not valid
        let enrolmentDate = getEnrolmentDate(enl);
        if (!enrolmentDate) return false;

        // Cache the last encounter
        let enc = enl.lastFulfilledEncounter('ANC - Saheli');
        if (!enc) return true;

        return encounterHasDueEncounter(enrolmentDate, enc);
    }

    // note in MLD we will be using the sequence number of the encounter to determine the latest encounter. So encounterDateTime desc will be replaced over there
    const encounters = params.db.objects('ProgramEncounter')
        .filtered(`voided == false 
                    AND encounterType.name == 'ANC - Saheli'
                    AND voided == false 
                    AND programEnrolment.individual.voided == false 
                    AND programEnrolment.voided == false 
                    AND programEnrolment.programExitDateTime == null
                    AND NONE programEnrolment.encounters.encounterType.name == 'Delivery - Saheli'`)
        .filtered('TRUEPREDICATE sort(programEnrolment.uuid asc , encounterDateTime desc) Distinct(programEnrolment.individual.uuid)');
    const individuals = encounters.filter((enc) => encounterHasDueEncounter(getEnrolmentDate(enc.programEnrolment), enc)).map(enl => enl.individual);

    // Use more specific filtering in the Realm query
    const noEncounterEnrolments = params.db.objects('ProgramEnrolment')
        .filtered(`voided == false 
                    AND program.name == 'Pregnancy' 
                    AND individual.voided == false 
                    AND programExitDateTime == null
                    AND subquery(encounters, $encounter, 
                                    $encounter.encounterType.name == 'ANC - Saheli' 
                                    AND $encounter.voided == false).@count == 0)
                                    `);

    return individuals.concat(noEncounterEnrolments.filter(enrolmentHasDueEncounter).map(enl => enl.individual));
};
