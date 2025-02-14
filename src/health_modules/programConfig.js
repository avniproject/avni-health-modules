import growthChartConfig from "./child/growthChartConfig";

const config = function (programName) {
    return programName ? growthChartConfig: {};
};

export {
    config
};