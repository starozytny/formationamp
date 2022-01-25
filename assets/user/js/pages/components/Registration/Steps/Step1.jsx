import React from "react";

import { Button }   from "@dashboardComponents/Tools/Button";
import { TeamList } from "@userPages/components/Profil/Team/TeamList";
import { Alert }    from "@dashboardComponents/Tools/Alert";

const CURRENT_STEP = 1;

export function Step1 ({ step, errors, onNext, onSelectWorker, allWorkers, workers, workersRegistered }) {
    let error = null;
    errors.length !== 0 && errors.forEach(err => {
        if(err.name === "workers"){
            error = <Alert type="danger">Veuillez sélectionner au moins 1 personne.</Alert>
        }
    })

    return <div className={"step-section step-workers" + (step === CURRENT_STEP ? " active" : "")}>

        <TeamList isRegistration={true} onSelectWorker={onSelectWorker}
                  data={allWorkers} workers={workers} workersRegistered={workersRegistered}/>

        {error}

        <div className="line line-buttons">
            <div/>
            <div className="btns-submit">
                <Button onClick={() => onNext(2)}>Etape suivante</Button>
            </div>
        </div>
    </div>
}