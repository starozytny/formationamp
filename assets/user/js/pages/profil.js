import "../../css/pages/profil.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { UserFormulaire } from "@userPages/components/Profil/UserForm";
import { BankFormulaire } from "@userPages/components/Profil/Bank/BankForm";
import { TeamFormulaire } from "@userPages/components/Profil/Team/TeamForm";
import { Team }           from "@userPages/components/Profil/Team/Team";
import { Banks }          from "@userPages/components/Profil/Bank/Banks";
import { Orders }         from "@userPages/components/Profil/Order/Orders";

Routing.setRoutingData(routes);

let el = document.getElementById("profil-update");
if(el){
    render(<div className="main-content">
        <UserFormulaire type="profil" element={JSON.parse(el.dataset.donnees)} />
    </div>, el)
}

el = document.getElementById("profil-teams");
if(el){
    render(<Team {...el.dataset}/>, el)
}

el = document.getElementById("team-create");
if(el){
    render(<div className="main-content">
        <TeamFormulaire type="create" />
    </div>, el)
}

el = document.getElementById("team-update");
if(el){
    render(<div className="main-content">
        <TeamFormulaire type="update" element={JSON.parse(el.dataset.donnees)} />
    </div>, el)
}

el = document.getElementById("profil-banks");
if(el){
    render(<Banks {...el.dataset} />, el)
}

el = document.getElementById("bank-create");
if(el){
    render(<div className="main-content">
        <BankFormulaire type="create" />
    </div>, el)
}

el = document.getElementById("profil-orders");
if(el){
    render(<Orders {...el.dataset} />, el)
}