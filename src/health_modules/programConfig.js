import growthChartConfig from "./child/growthChartConfig";

const programConfigExports = {};
programConfigExports.programName = growthChartConfig;

const config = function (programName) {
    return !programName ? programConfigExports : programConfigExports.programName;
};

export {
    config
};