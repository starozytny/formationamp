import React from "react";

const CURRENT_STEP = 4;

export function Step4 ({ step, email }) {
    return <div className={"step-section step-workers" + (step === CURRENT_STEP ? " active" : "")}>

        <div className="validation">
            <div className="review-infos">
                <h2 className="txt-danger">Inscription validée</h2>
                <div className="content">
                    <p>
                        Un mail de confirmation vous sera envoyé à l'adresse suivante : <b>{email}</b>
                        <br/><br/>
                        Suivez les instructions du mail pour <b>finaliser votre inscription</b>.
                        <br/>
                        Le mail de confirmation sera valide pendant <b>2 heures</b> suite à la validation de ce formulaire.
                        <br/><br/>
                        Veuillez vérifier vos courriers indésirables/spams.
                    </p>
                </div>
            </div>
        </div>
    </div>
}