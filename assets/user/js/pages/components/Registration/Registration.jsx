import React, { Component } from "react";

import axios      from "axios";
import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button } from "@dashboardComponents/Tools/Button";
import { Aside }  from "@dashboardComponents/Tools/Aside";

import helperRegistration from "./functions/helper";
import Helper     from "@commonComponents/functions/helper";
import Validateur from "@commonComponents/functions/validateur";
import Formulaire from "@dashboardComponents/functions/Formulaire";
import helper     from "@userComponents/functions/helper";
import UpdateList from "@dashboardComponents/functions/updateList";

import { Step1 } from "@userPages/components/Registration/Steps/Step1";
import { Step2 } from "@userPages/components/Registration/Steps/Step2";
import { Step3 } from "@userPages/components/Registration/Steps/Step3";
import { Step4 } from "@userPages/components/Registration/Steps/Step4";

import { BankFormulaire } from "@userPages/components/Profil/Bank/BankForm";

const URL_CREATE_REGISTRATION = 'api_registration_create';
const URL_DELETE_BANK         = 'api_banks_delete';

let arrayBicSave = [];
let arrayZipcodes = [];

export class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contextBank: "create",
            email: props.email,
            session: JSON.parse(props.session),
            allWorkers: JSON.parse(props.workers),
            allBanks: JSON.parse(props.banks),
            workersRegistered: JSON.parse(props.workersRegistered),
            bank: null,
            workers: [],
            bankSpecials: [],
            errors: [],
            arrayPostalCode: [],
            arrayBic: [],
            step: 1
        }

        this.asideBank = React.createRef();

        this.handleNext = this.handleNext.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSelectWorker = this.handleSelectWorker.bind(this);
        this.handleSelectBank = this.handleSelectBank.bind(this);
        this.handleDeleteBank = this.handleDeleteBank.bind(this)
        this.handleOpenAsideBank = this.handleOpenAsideBank.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () => {
        Helper.getPostalCodes(this);
        Helper.getBicCodes(this);
    }

    handleUpdateList = (element, context, type) => {
        switch (type){
            default:
                let newData = UpdateList.update(context, this.state.allBanks, element);
                this.setState({ allBanks: newData, bank: element })
                if(this.asideBank.current) this.asideBank.current.handleClose();
                break;
        }
    }

    handleDeleteBank = (element, msg, text='Cette action est irr??versible.') => {
        let url = Routing.generate(URL_DELETE_BANK, {'id': element.id})
        Formulaire.axiosDeleteElement(this, element, url, "Supprimer ce RIB ?", text);
    }

    handleSelectWorker = (worker) => {
        const { workers } = this.state;

        let nWorkers = helper.addOrRemove(workers, worker, "Membre s??lectionn??.", "Membre enlev??.");
        this.setState({ workers: nWorkers });
    }

    handleSelectBank = (bank) => { this.setState({ bank }) }

    handleOpenAsideBank = (contextBank, bank= null) => {
        this.setState({ contextBank, bank })
        this.asideBank.current.handleOpen();
    }

    handleBankCommercial = (workerId, bank) =>{
        const { bankSpecials } = this.state;

        let nBanks = [];

        let find = false;
        bankSpecials.forEach(b => {
            if(b.workerId === workerId){
                find = true;
            }
        })

        if(find){
            nBanks = bankSpecials.filter(el => el.workerId !== workerId);
        }else{
            nBanks = bankSpecials;
            nBanks.push({
                workerId: workerId,
                bank: bank
            })
        }

        this.setState({ bankSpecials: nBanks })
    }

    handleNext = (stepClicked, stepInitial = null) => {
        const { workers, bank, bankSpecials } = this.state;

        let paramsToValidate = [];
        if(stepInitial === null){
            switch (stepClicked){
                case 3:
                    let [workersRegulars, workersSpecials] = helperRegistration.getWorkers(workers);

                    if(workersRegulars.length !== 0 || (workersSpecials.length !== 0 && bankSpecials.length === 0 && bank === null)){
                        paramsToValidate = [...paramsToValidate,
                            ...[{type: "text",  id: 'bank', value: bank}]
                        ];
                    }

                    if(workersSpecials.length !== 0){
                        if(bank === null){
                            paramsToValidate = [...paramsToValidate,
                                ...[{type: "array",  id: 'bankSpecials', value: bankSpecials}]
                            ];
                        }
                    }
                    break;
                default:
                    paramsToValidate = [
                        {type: "array",  id: 'workers', value: workers},
                    ];
                    break;
            }
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate);

        Helper.toTop();
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            this.setState({ errors: [], step: stepClicked })
        }
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

            let workersRegulars = [], workersSpecials = [];
            workers.forEach(worker => {
                if(worker.type !== 2) {
                    workersRegulars.push(worker.id)
                }else{
                    workersSpecials.push(worker.id)
                }
            })

            this.state.workersRegularsId = workersRegulars;
            this.state.workersSpecialsId = workersSpecials;

            arrayZipcodes = this.state.arrayPostalCode;
            delete this.state.arrayPostalCode;
            arrayBicSave = this.state.arrayBic;
            delete this.state.arrayBic;

            axios({ method: "POST", url: Routing.generate(URL_CREATE_REGISTRATION, {'session': session.id}), data: this.state })
                .then(function (response) {
                    let data = response.data;
                    Helper.toTop();
                    self.setState({ step: 4 })
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
        const { step, contextBank, bank, arrayPostalCode, arrayBic } = this.state;

        let steps = [
            {id: 1, label: "Participants"},
            {id: 2, label: "Compte(s) bancaire(s)"},
            {id: 3, label: "R??capitulatif"},
            {id: 4, label: "Validation"},
        ];

        let stepTitle = "Etape 1 : Participants";
        let stepsItems = [];
        steps.forEach(el => {
            let active = "";
            if(el.id === step){
                active = " active";
                stepTitle = "Etape " + el.id + " : " + el.label;
            }

            stepsItems.push(<div className={"item" + active} key={el.id}>
                <span className="number">{el.id} - </span>
                <span className="label">{el.label}</span>
            </div>)
        })

        let contentBank = contextBank === "create" ? <BankFormulaire type="create" isRegistration={true} onUpdateList={this.handleUpdateList}/>
            : <BankFormulaire type="update" element={bank} isRegistration={true} onUpdateList={this.handleUpdateList} key={bank.id}/>

        let nArrayPostalCode = arrayPostalCode ? arrayPostalCode : arrayZipcodes;
        let nArrayBic = arrayBic ? arrayBic : arrayBicSave;

        return <>
            <div className="main-content">
                <div className="session-registration">
                    <div className="steps">
                        {stepsItems}
                    </div>

                    <h2>{stepTitle}</h2>

                    <form onSubmit={this.handleSubmit}>

                        <Step1 {...this.state} onNext={this.handleNext} onSelectWorker={this.handleSelectWorker} />

                        <Step2 {...this.state} onNext={this.handleNext} onSelectBank={this.handleSelectBank}
                               onOpenAside={this.handleOpenAsideBank} onDelete={this.handleDeleteBank}
                               onBankCommercial={this.handleBankCommercial}
                               arrayPostalCode={nArrayPostalCode} arrayBic={nArrayBic} />

                        {step === 3 && <Step3 {...this.state} onNext={this.handleNext} onSubmit={this.handleSubmit}/>}

                        <Step4 {...this.state} onNext={this.handleNext} onSubmit={this.handleSubmit}/>

                    </form>
                </div>
            </div>
            <Aside ref={this.asideBank} content={contentBank} />
        </>
    }
}


export function FormActions ({ onNext, currentStep }) {
    return <div className="line line-buttons">
        <Button type="default" outline={true} onClick={() => onNext(currentStep - 1, currentStep)}>Etape pr??c??dente</Button>
        <div/>
        <div className="btns-submit">
            <Button onClick={() => onNext(currentStep + 1)}>Etape suivante</Button>
        </div>
    </div>
}
