import _ from "lodash";
import growthChartBoys from "/src/health_modules/adolescent/metadata/adolesecent_growth_chart_boys.json";
import growthChartGirls from "/src/health_modules/adolescent/metadata/adolesecent_growth_chart_girls.json";

const getStatusData = (data) => [
    {value: data.severe_mn, zScore: -3},
    {value: data.moderate_mn, zScore: -2},
    {value: data.mild_mn, zScore: -1},
    {value: data.normal, zScore: 0},
    {value: data.mild_ob, zScore: 1},
    {value: data.moderate_ob, zScore: 2},
    {value: data.severe_ob, zScore: 3}
];


const getStatus = (arrayDataObj, bmi) => {
    for (const item of arrayDataObj) {
        if (bmi <= item.value) {
            return item.zScore;
        }
    }
    return 3; // Default status if weight exceeds all thresholds (severe_ob)
}

const calculateGrowthStatus = (individual, bmi, asOnDate) => {
    let ageInMonths = individual.getAgeInMonths(asOnDate);
    let gender = _.get(individual, "gender.name");
    let growthStatusValuesJson = gender === 'Female' ? growthChartGirls : growthChartBoys;
    let values = _.find(growthStatusValuesJson, (item) => item.month == ageInMonths);
    if (ageInMonths < 121 || ageInMonths > 228) {
        return {zScore: undefined};
    } else {
        return {zScore: getStatus(getStatusData(values), bmi)};
    }
}

export default calculateGrowthStatus;


