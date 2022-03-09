import "../../css/pages/changelog.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Changelogs } from "@dashboardPages/components/Changelogs/Changelogs";

Routing.setRoutingData(routes);

let el = document.getElementById("changelogs");
if(el){
    render(<Changelogs {...el.dataset}/>, el)
}
