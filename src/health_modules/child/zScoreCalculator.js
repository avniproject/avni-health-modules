import _ from "lodash";
import wfa_boys from "./anthropometry/wfa_boys.json";
import wfa_girls from "./anthropometry/wfa_girls.json";
import hfa_boys from "./anthropometry/lhfa_boys.json";
import hfa_girls from "./anthropometry/lhfa_girls.json";
import wfh_boys from "./anthropometry/wflh_boys.json";
import wfh_girls from "./anthropometry/wflh_girls.json";

const isPropNil = (o, path) => _.isNil(_.get(o, path));

const anthropometricReference = {
    wfa: {Male: wfa_boys, Female: wfa_girls},
    hfa: {Male: hfa_boys, Female: hfa_girls},
    wfh: {Male: wfh_boys, Female: wfh_girls}
};

const roundedHeight = (num) => {
    return Math.round(num * 2) / 2;
};

const getWfaReference = (gender, ageInMonths) => {
    let wfaReference = _.get(anthropometricReference, ["wfa", gender]);
    return _.find(wfaReference, (item) => item.Month === ageInMonths);
}

const getWfhReference = (gender, height) => {
    let wfhReference = _.get(anthropometricReference, ["wfh", gender]);
    return _.find(wfhReference, (item) => item.x === roundedHeight(height));
}

const getHfaReference = (gender, ageInMonths) => {
    let heightForAgeReference = _.get(anthropometricReference, ["hfa", gender]);
    return _.find(heightForAgeReference, (item) => item.Month === ageInMonths);
}

function calc_sd(reference, sd) {
    const {L, M, S} = reference;
    return M * ((1 + L * S * sd) ^ (1 / L));
}

function roundToOneDecimal(value) {
    return Math.round(10 * value) / 10;
}

/**
 * Uses the LMS formula to calculate zScore.
 *
 * Note: Weight/height measurements are available only for the nearest single digit, so
 * the final figure can only have one degree of accuracy.
 * @param value
 * @param reference
 * @returns {*}
 */
const calculate = (value, reference) => {
    if (!value || value === 0 || !reference) return undefined;

    // https://github.com/WorldHealthOrganization/anthro/blob/master/R/z-score-helper.R#L28
    const sd3pos = calc_sd(reference, 3);
    const sd3neg = calc_sd(reference, -3);
    const sd23pos = sd3pos - calc_sd(reference, 2);
    const sd23neg = calc_sd(reference, 2) - sd3neg;

    let zScore = roundToOneDecimal((Math.pow(value / reference.M, reference.L) - 1) / (reference.S * reference.L));

    if (Math.round(zScore) > 3)
        zScore = roundToOneDecimal(3 + ((value - sd3pos) / sd23pos));
    else if (Math.round(zScore) < -3)
        zScore = roundToOneDecimal(-3 + ((value - sd3neg) / sd23neg));

    return zScore;
};

const calculateZScore = (gender, ageInMonths, weight, height) => {
    let wfaReference = getWfaReference(gender, ageInMonths);
    let hfaReference = getHfaReference(gender, ageInMonths);
    let wfhReference = getWfhReference(gender, height);

    return {
        wfa: calculate(weight, wfaReference),
        hfa: calculate(height, hfaReference),
        wfh: calculate(weight, wfhReference)
    }
};

const zScore = (individual, asOnDate, weight, height) => {
    let ageInMonths = individual.getAgeInMonths(asOnDate);
    let gender = _.get(individual, "gender.name");

    return calculateZScore(gender, ageInMonths, weight, height);
};

const projectedSD2NegForWeight = (individual, asOnDate) => {
    let age = individual.getAgeInMonths(asOnDate, true);
    let decimalPortion = age % 1;
    let ageInMonths = individual.getAgeInMonths(asOnDate);
    let gender = _.get(individual, "gender.name");
    let wfa = getWfaReference(gender, ageInMonths);
    let nextMonthWfa = getWfaReference(gender, ageInMonths + 1);
    if (isPropNil(nextMonthWfa, 'SD2neg') || isPropNil(wfa, 'SD2neg')) {
        return;
    }
    let sD2negDelta = nextMonthWfa.SD2neg - wfa.SD2neg;
    let projectedSD2Neg = wfa.SD2neg + (decimalPortion * sD2negDelta);
    return projectedSD2Neg;
}

export {zScore as default, projectedSD2NegForWeight};
