import React from "react";

import helperRegistration from "../functions/helper";

import { FormActions }    from "@userPages/components/Registration/Registration";
import { BanksList }      from "@userPages/components/Profil/Bank/BanksList";
import { Alert }          from "@dashboardComponents/Tools/Alert";
import { BankFormulaire } from "@userPages/components/Profil/Bank/BankForm";

const CURRENT_STEP = 2;

export function Step2 ({ step, errors, onNext, onSelectBank, onDelete, onOpenAside, allBanks, bank, workers, bankSpecials,
                           arrayPostalCode, arrayBic, onBankCommercial }) {
    let error = null, error2 = null;
    errors.length !== 0 && errors.forEach(err => {
        if(err.name === "bank"){
            error = <Alert type="danger">Veuillez sélectionner au moins une banque pour l'agence.</Alert>
        }

        if(err.name === "bankSpecials"){
            error2 = <Alert type="danger">Veuillez sélectionner une banque pour les agents commerciaux.</Alert>
        }
    })

    let [workersRegulars, workersSpecials] = helperRegistration.getWorkers(workers);

    return <div className={"step-section step-workers" + (step === CURRENT_STEP ? " active" : "")}>

        <section className="registration-bank">
            <div>
                <div className="title"><span>Agence : </span></div>
                <div className="workers-selectionned">
                    {workersRegulars.map(worker => {
                        return <span key={worker.id}>{worker.lastname} {worker.firstname}</span>
                    })}
                </div>
            </div>

            <BanksList isRegistration={true} data={allBanks} bank={bank}
                       onSelectBank={onSelectBank} onOpenAside={onOpenAside} onDelete={onDelete}/>
        </section>

        {workersSpecials.map(worker => {

            let workerBank = null;
            bankSpecials.forEach(b => {
                if(b.workerId === worker.id){
                    workerBank = b.bank
                }
            })

            return <section className="registration-bank" key={worker.id}>
                <div>
                    <div className="title"><span>Agent commercial : </span></div>
                    <div className="workers-selectionned">
                        <span>{worker.lastname} {worker.firstname}</span>
                    </div>
                </div>

                {workerBank === null ? <>
                    <BankFormulaire type="commercial" isRegistration={true} worker={worker}
                                    zipcodes={arrayPostalCode} arrayBic={arrayBic}
                                    onBankCommercial={onBankCommercial}/>
                </> : <BanksList isRegistration={true} data={[workerBank]} bank={workerBank} workerId={worker.id}
                                 isCommercial={true} onBankCommercial={onBankCommercial} />}

            </section>
        })}

        {error}
        {error2}

        <FormActions onNext={onNext} currentStep={CURRENT_STEP} />
    </div>
}
