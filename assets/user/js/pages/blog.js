import "../../css/pages/blog.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";

Routing.setRoutingData(routes);

let el = document.getElementById("blog");
if(el){
    render(<div className="main-content">Hello</div>, el)
}
