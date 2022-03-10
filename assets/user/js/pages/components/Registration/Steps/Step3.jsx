import React from "react";

import { Alert }       from "@dashboardComponents/Tools/Alert";
import { Button }      from "@dashboardComponents/Tools/Button";

import Sanitaze           from "@commonComponents/functions/sanitaze"
import helperRegistration from "@userPages/components/Registration/functions/helper";

const CURRENT_STEP = 3;

export function Step3 ({ step, onNext, onSubmit, email, session, workers, bank, bankSpecials }) {

    let [workersRegulars, workersSpecials] = helperRegistration.getWorkers(workers);

    let participants = workersRegulars.length + workersSpecials.length;
    let total = participants * session.priceTTC;

    return <div className={"step-section step-workers" + (step === CURRENT_STEP ? " active" : "")}>

        <div className="review">
            <Alert type="reverse" title="Important !">
                Un mail de confirmation vous sera envoyé à l'adresse suivante : <b>{email}</b>
                <br/><br/>
                Suivez les instructions du mail pour <b>finaliser votre inscription</b>.
                <br/>
                Le mail de confirmation sera valide pendant <b>2 heures</b> suite à la validation de ce formulaire.
                <br/><br/>
                Veuillez vérifier vos courriers indésirables/spams.
            </Alert>

            <div className="review-infos">
                <h2>Inscription pour</h2>
                <div className="content">
                    <div className="title">{session.formation.name}</div>
                    <div>{session.fullDateHuman} {session.fullTime} pour une durée totale de {session.durationTotal}.</div>
                    <div className="address">Adresse : {session.fullAddress}</div>
                    <div className="prices">
                        <div>Montant HT : <span>{Sanitaze.toFormatCurrency(session.priceHT)} par participant.</span></div>
                        <div>Montant TTC : <span>{Sanitaze.toFormatCurrency(session.priceTTC)} par participant.</span></div>
                    </div>
                </div>
            </div>

            <div className="review-participants">
                <div className="item">
                    <div className="items-table">
                        <div className="items items-default">
                            <div className="item item-header">
                                <div className="item-content">
                                    <div className="item-body">
                                        <div className="infos infos-col-3">
                                            <div className="col-1">Compte bancaire AGENCE</div>
                                            <div className="col-2">Participants</div>
                                            <div className="col-3 actions">Montant TTC</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {workersRegulars.length !== 0 && <Item session={session} workers={workersRegulars} bank={bank} />}
                            {workersSpecials.length !== 0 && <div className="item item-header">
                                <div className="item-content">
                                    <div className="item-body">
                                        <div className="infos infos-col-3">
                                            <div className="col-1">Compte bancaire AGENTS COMMERCIAUX</div>
                                            <div className="col-2">Participants</div>
                                            <div className="col-3 actions">Montant TTC</div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            {workersSpecials.length !== 0 && workersSpecials.map((worker, index) => {

                                let bankWorker = null;
                                bankSpecials.forEach(b => {
                                    if(b.workerId === worker.id){
                                        bankWorker = b.bank;
                                    }
                                })

                                return <Item session={session} workers={[worker]} bank={bankWorker} isBankAgence={bankWorker == null} key={index}/>
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="review-total">
                <Alert type="info" withIcon={false}>
                    En additionnant tous les comptes bancaires :
                    <br/><br/>
                    <b className="total">Total de {Sanitaze.toFormatCurrency(total)} € TTC pour {participants} participant{participants > 1 ? "s" : ""}.</b>
                </Alert>
            </div>
        </div>


        <div className="line line-buttons">
            <Button type="default" outline={true} onClick={() => onNext(CURRENT_STEP - 1, CURRENT_STEP)}>Etape précédente</Button>
            <div/>
            <div className="btns-submit">
                <Button onClick={onSubmit}>Valider</Button>
            </div>
        </div>
    </div>
}

function Item({ bank, workers, session, isBankAgence=false }) {
    let totalDefault = 0;

    return <div className="item">
        <div className="item-content">
            <div className="item-body">
                <div className="infos infos-col-3">
                    <div className="col-1">
                        {!isBankAgence ? <>
                            <div className="name">
                                <span>{bank.iban}</span>
                            </div>
                            <div className="sub">{bank.bic}</div>
                            <div className="sub">{bank.titulaire}</div>
                        </> : <div className="name txt-danger">Compte bancaire AGENCE utilisé</div>}
                    </div>
                    <div className="col-2">
                        {workers.map((el, index) => {
                            return <div key={index}>{el.lastname} {el.firstname}</div>
                        })}
                    </div>
                    <div className="col-3 actions">
                        {workers.map((el, index) => {
                            totalDefault = session.priceTTC;
                            return <div key={index}>{Sanitaze.toFormatCurrency(session.priceTTC)}</div>
                        })}
                        <div className="total"><b>Total : {Sanitaze.toFormatCurrency(totalDefault * workers.length)}</b></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
