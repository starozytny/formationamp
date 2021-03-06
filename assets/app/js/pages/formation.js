import '../../css/pages/formation.scss';

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from 'react';
import { render } from 'react-dom';
import { Sessions } from "@userPages/components/Session/Sessions";

Routing.setRoutingData(routes);

let el = document.getElementById("sessions");
if(el){
    render(<Sessions {...el.dataset} isFromApp={true} />, el)
}