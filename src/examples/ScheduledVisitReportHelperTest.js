const offsetBaseDate = {
    type: "Enrolment",
    concept: "LMP"
}

// these are made up numbers for testing
const offsets = [
    {number: 1, due: 100, overdue: 120},
    {number: 2, due: 120, overdue: 140},
    {number: 3, due: 150, overdue: 170},
    {number: 4, due: 180, overdue: 200},
    {number: 5, due: 210, overdue: 230},
    {number: 6, due: 240, overdue: 260},
    {number: 7, due: 270, overdue: 290}
];

const terminatingProgramVisitTypes = ["Delivery", "PNC", "Abortion", "Death"];
const terminatingVisitTypes = ["Death"];

isThereAFollowupEncounterFor(offsetBaseDate, "ANC", offsets, terminatingProgramVisitTypes, terminatingVisitTypes, encounter);

function isThereAFollowupEncounterFor(offsetBaseDate, encounterTypeName, offsets, terminatingProgramVisitTypes = [], terminatingVisitTypes = [], encounter) {
    // implement this function
    // should return true or false
}

function doesThisEnrolmentHasDueEncounter(enrolment, encounterTypeName, offsets, terminatingProgramVisitTypes = [], terminatingVisitTypes = []) {
    // implement this function
    // should return true or false
}

// make these tests pass: isThereAFollowupEncounterFor

// 1. true if LMP is 100 days ago and there is no sequence number 1
// 2. true if LMP is 120 days ago and there is no sequence number 2
// 3. false if LMP is 80 days ago
// 5. false if LMP is 260 days ago but there is an ANC visit with sequence number 7
