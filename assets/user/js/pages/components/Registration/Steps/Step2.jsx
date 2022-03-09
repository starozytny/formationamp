import React from "react";

import { FormActions }    from "@userPages/components/Registration/Registration";
import { BanksList }      from "@userPages/components/Profil/Bank/BanksList";
import { Alert }          from "@dashboardComponents/Tools/Alert";
import { BankFormulaire } from "@userPages/components/Profil/Bank/BankForm";

const CURRENT_STEP = 2;

export function Step2 ({ step, errors, onNext, onSelectBank, onDelete, onOpenAside, allBanks, bank, workers, bankSpecials,
                           arrayPostalCode, arrayBic, onBankCommercial }) {
    let error = null;
    errors.length !== 0 && errors.forEach(err => {
        if(err.name === "bank"){
            error = <Alert type="danger">Veuillez sélectionner au moins 1 banque.</Alert>
        }
    })

    let workersRegulars = [], workersSpecials = [];
    workers.forEach(worker => {
        if(worker.type !== 2) {
            workersRegulars.push(worker)
        }else{
            workersSpecials.push(worker)
        }
    })

    return <div className={"step-section step-workers" + (step === CURRENT_STEP ? " active" : "")}>

        {workersRegulars.length !== 0 && <section className="registration-bank">
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
        </section>}

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

        <FormActions onNext={onNext} currentStep={CURRENT_STEP} />
    </div>
}
