import wfa_boys from "../../health_modules/child/anthropometry/wfa_boys.json";
import lhfa_boys from "../../health_modules/child/anthropometry/lhfa_boys.json";
import wfa_girls from "../../health_modules/child/anthropometry/wfa_girls.json";
import lhfa_girls from "../../health_modules/child/anthropometry/lhfa_girls.json";
import wfh_boys_upto_2_years from "./anthropometry/wflh_boys_0-to-2-years.json";
import wfh_boys_after_2_years from "./anthropometry/wflh_boys_2-to-5-years.json";
import wfh_girls_upto_2_years from "./anthropometry/wflh_girls_0-to-2-years.json";
import wfh_girls_after_2_years from "./anthropometry/wflh_girls_2-to-5-years.json";

const dataFn = (enrolment) => {
    let ageInMonths = enrolment.individual.getAgeInMonths(new Date());
    return enrolment.individual.isMale()? {weightForAge: wfa_boys, heightForAge: lhfa_boys,
          weightForHeight: ageInMonths < 24 ? wfh_boys_upto_2_years : wfh_boys_after_2_years}:
        {weightForAge: wfa_girls, heightForAge: lhfa_girls,
            weightForHeight: ageInMonths < 24 ? wfh_girls_upto_2_years : wfh_girls_after_2_years};
};

const config = {
    programDashboardButtons: [{
        label: "Growth Chart",
        openOnClick: {
            type: "growthChart",
            data: dataFn
        }
    }]
};

export default config;