import React, { Component } from "react";

import axios      from "axios";
import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Alert }  from "@dashboardComponents/Tools/Alert";
import { Button } from "@dashboardComponents/Tools/Button";

import Sort       from "@commonComponents/functions/sort";
import Helper     from "@commonComponents/functions/helper";
import Validateur from "@commonComponents/functions/validateur";
import Formulaire from "@dashboardComponents/functions/Formulaire";

import { TeamItemRegistrationUpdate } from "@userPages/components/Profil/Team/TeamItem";

const URL_UPDATE_REGISTRATION = 'api_registration_create';

export class RegistrationUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sessionId: props.sessionId,
            allWorkers: JSON.parse(props.workers),
            registrations: JSON.parse(props.registrations),
            errors: [],
        }

        this.handleSelectWorker = this.handleSelectWorker.bind(this);
        this.handleTrashWorker = this.handleTrashWorker.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSelectWorker = (registration, oldWorker, e) => {
        const { allWorkers, registrations } = this.state;

        //worker to add;
        let value = null;

        //get data of newWorker
        allWorkers.forEach(el => {
            if(e && el.id === e.value){
                value = el;
            }
        })

        if(!e){ //if no one selected
            registration.worker = oldWorker;
        }else{
            registration.worker = value;
        }

        let nRegistrations = [];
        registrations.forEach(el => {
            if(el.id === registration.id){
                nRegistrations.push(registration)
            }else{
                nRegistrations.push(el);
            }
        })

        this.setState({ registrations: nRegistrations })
    }

    handleTrashWorker = (registration, elem) => {

    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { sessionId, workers, workersToDelete } = this.state;

        let paramsToValidate = [];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;

            axios({ method: "PUT", url: Routing.generate(URL_UPDATE_REGISTRATION, {'session': sessionId}), data: this.state })
                .then(function (response) {
                    let data = response.data;
                    Helper.toTop();
                })
                .catch(function (error) {
                    Formulaire.displayErrors(self, error);
                })
                .then(() => {
                    Formulaire.loader(false);
                })
            ;
        }
    }

    render () {
        const { registrations } = this.state;

        return <div className="main-content">
            <form onSubmit={this.handleSubmit}>
                <div>
                    <div className="items-table">
                        <div className="items items-default">
                            <div className="item item-header">
                                <div className="item-content">
                                    <div className="item-body">
                                        <div className="infos infos-col-3">
                                            <div className="col-1">Equipe</div>
                                            <div className="col-2">Remplacement</div>
                                            <div className="col-3 actions">Supression</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {registrations && registrations.length !== 0 ? registrations.map(el => {
                                return <TeamItemRegistrationUpdate {...this.state} elem={el.worker} registration={el} key={el.id}
                                                                   onChangeSelect={this.handleSelectWorker} onTrash={this.handleTrashWorker}/>
                            }) : <Alert>Aucun résultat</Alert>}
                        </div>
                    </div>
                </div>

                <div className="line line-buttons">
                    <div/>
                    <div/>
                    <div className="btns-submit">
                        <Button onClick={this.handleSubmit}>Enregistrer les modifications</Button>
                    </div>
                </div>
            </form>
        </div>
    }
}