import "../../css/pages/formations.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Sessions }     from "@userPages/components/Session/Sessions";
import { Registration } from "@userPages/components/Session/Registration/Registration";
import { MySessions }   from "@userPages/components/Session/My/MySessions";

Routing.setRoutingData(routes);

let el = document.getElementById("sessions");
if(el){
    render(<Sessions {...el.dataset} />, el)
}

el = document.getElementById("session-registration");
if(el){
    render(<Registration {...el.dataset} />, el)
}

el = document.getElementById("my-formations");
if(el){
    render(<MySessions {...el.dataset} />, el)
}