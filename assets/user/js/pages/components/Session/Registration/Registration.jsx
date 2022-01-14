import React, { Component } from "react";

import axios      from "axios";
import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button } from "@dashboardComponents/Tools/Button";

import Validateur from "@commonComponents/functions/validateur";
import Formulaire from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_REGISTRATION = 'api_registration_create';

export class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            session: JSON.parse(props.session),
            workers: JSON.parse(props.workers),
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { session, workers } = this.state;

        let paramsToValidate = [];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;

            // TO ADJUST
            let workersId = [];
            workers.forEach(worker => {
                workersId.push(worker.id)
            })

            this.state.workersId = workersId;

            axios({ method: "POST", url: Routing.generate(URL_CREATE_REGISTRATION, {'session': session.id}), data: this.state })
                .then(function (response) {
                    let data = response.data;
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
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
        const { workers } = this.state;

        return <div className="main-content">
            <form onSubmit={this.handleSubmit}>

                <div className="step step-1">
                    {workers.map(worker => {
                        return <div key={worker.id}>
                            <div>{worker.lastname} {worker.firstname}</div>
                            <div className="sub">{worker.typeString}</div>
                        </div>
                    })}
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>Valider</Button>
                    </div>
                </div>
            </form>
        </div>
    }
}