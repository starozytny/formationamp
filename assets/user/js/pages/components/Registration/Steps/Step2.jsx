import React from "react";

import { FormActions } from "@userPages/components/Registration/Registration";
import { BanksList }   from "@userPages/components/Profil/Bank/BanksList";
import { Alert }       from "@dashboardComponents/Tools/Alert";

const CURRENT_STEP = 2;

export function Step2 ({ step, errors, onNext, onSelectBank, onDelete, onOpenAside, allBanks, bank }) {
    let error = null;
    errors.length !== 0 && errors.forEach(err => {
        if(err.name === "bank"){
            error = <Alert type="danger">Veuillez sélectionner au moins 1 banque.</Alert>
        }
    })

    return <div className={"step-section step-workers" + (step === CURRENT_STEP ? " active" : "")}>

        <BanksList isRegistration={true} data={allBanks} bank={bank}
                   onSelectBank={onSelectBank} onOpenAside={onOpenAside} onDelete={onDelete}/>

        {error}

        <FormActions onNext={onNext} currentStep={CURRENT_STEP} />
    </div>
}