import _ from "lodash";
import growthChartBoys from "/src/health_modules/adolescent/metadata/adolesecent_growth_chart_boys.json";
import growthChartGirls from "/src/health_modules/adolescent/metadata/adolesecent_growth_chart_girls.json";

const getStatusData = (data) => [
    {value: data.severe_mn, status: -3},
    {value: data.moderate_mn, status: -2},
    {value: data.mild_mn, status: -1},
    {value: data.normal, status: 0},
    {value: data.mild_ob, status: 1},
    {value: data.moderate_ob, status: 2},
    {value: data.severe_ob, status: 3}
];


const getStatus = (arrayDataObj,weight) => {
    for (const item of arrayDataObj) {
        if (weight <= item.value) {
            return item.status;
        }
    }
    return 3; // Default status if weight exceeds all thresholds (severe_ob)
}

const calculateGrowthStatus = (individual, weight, asOnDate) => {
    let ageInMonths = individual.getAgeInMonths(asOnDate);
    let gender = _.get(individual, "gender.name");
    let growthStatusValuesJson = gender === 'Female' ? growthChartGirls : growthChartBoys;
    let values = _.find(growthStatusValuesJson, (item) => item.month == ageInMonths);

    return {wfaStatus:getStatus(getStatusData(values),weight)};
}

export default calculateGrowthStatus;


