import React, { Component } from 'react';

import axios                from "axios";
import Routing              from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }           from "@dashboardComponents/Tools/Button";
import { Alert }            from "@dashboardComponents/Tools/Alert";
import {Checkbox, Input, Radiobox} from "@dashboardComponents/Tools/Fields";

import Formulaire           from "@dashboardComponents/functions/Formulaire";
import Validateur           from "@commonComponents/functions/validateur";
import Sanitaze             from "@commonComponents/functions/sanitaze";
import Helper               from "@commonComponents/functions/helper";

const URL_CREATE_ELEMENT     = "api_banks_create";
const URL_UPDATE_GROUP       = "api_banks_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

let arrayBicSave = [];

export function BankFormulaire ({ type, element, onUpdateList, isRegistration=false,
                                    worker = null, zipcodes = [], arrayBic = [], onBankCommercial = null })
{
    let title = "Ajouter un RIB";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez ajouté un nouveau RIB !"

    if(type === "update" || type === "profil"){
        title = "Modifier " + element.iban;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";
    }else if(type === "commercial"){
        title = null;
        url = null;
        msg = "Données mises à jour"
    }

    let form = <Form
        context={type}
        url={url}
        titulaire={element ? element.titulaire : ""}
        iban={element ? element.iban : ""}
        bic={element ? element.bic : ""}
        address={type === "commercial" ? (element ? Formulaire.setValueEmptyIfNull(element.address) : "") : ""}
        zipcode={type === "commercial" ? (element ? Formulaire.setValueEmptyIfNull(element.zipcode) : "") : ""}
        city={type === "commercial" ? (element ? Formulaire.setValueEmptyIfNull(element.city) : "") : ""}
        choice={type === "commercial" ? (element ? Formulaire.setValueEmptyIfNull(element.choice, 0) : 0) : 0}
        zipcodes={zipcodes}
        arrayBic={arrayBic}
        onUpdateList={onUpdateList}
        onBankCommercial={onBankCommercial}
        identifiant={worker ? worker.id : 0}
        messageSuccess={msg}
    />

    return <>
        {!isRegistration && <div className="toolbar">
            <div className="item">
                <Button element="a" outline={true} icon="left-arrow" type="primary" onClick={Routing.generate('user_profil')}>Retour à mon profil</Button>
            </div>
        </div>}

        <div className="form">
            {title ? <h2>{title}</h2> : null}
            {form}
        </div>
    </>
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            titulaire: props.titulaire,
            iban: props.iban,
            bic: props.bic,
            address: props.address,
            zipcode: props.zipcode,
            city: props.city,
            choice: props.choice,
            arrayPostalCode: props.zipcodes,
            errors: [],
            arrayBic: props.arrayBic ? props.arrayBic : [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeZipcodeCity = this.handleChangeZipcodeCity.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { context } = this.props;

        if(context !== "commercial"){
            Helper.getBicCodes(this);
        }
    }

    handleChangeZipcodeCity = (e) => {
        const { arrayPostalCode } = this.state;

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        let index = name.indexOf("-")
        name = name.substring(0, index);

        if(value.length <= 5){
            this.setState({ [name]: value })

            let v = ""
            if(arrayPostalCode.length !== 0){
                v = arrayPostalCode.filter(el => el.cp === value)

                if(v.length === 1){
                    this.setState({ city: v[0].city })
                }
            }
        }
    }

    handleChange = (e) => {
        const { arrayBic } = this.state;

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        let index = name.indexOf("-")
        name = name.substring(0, index);

        if(name === "iban"){
            value = Sanitaze.toFormatIban(value);

            Helper.setBicFromIban(this, value, arrayBic)
        }

        if(name === "iban" || name === "bic" || name === "titulaire"){
            value = value.toUpperCase()
        }

        this.setState({[name]: value})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess, identifiant } = this.props;
        const { titulaire, iban, bic, address, zipcode, city } = this.state;

        this.setState({ success: false, errors: []})

        let method = context === "create" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text", id: 'titulaire-' + identifiant,  value: titulaire},
            {type: "iban", id: 'iban-' + identifiant,       value: iban},
            {type: "text", id: 'bic-' + identifiant,        value: bic},
        ];

        if(context === "commercial"){
            paramsToValidate = [...paramsToValidate,
                ...[
                    {type: "text", id: 'address-' + identifiant, value: address},
                    {type: "text", id: 'zipcode-' + identifiant, value: zipcode},
                    {type: "text", id: 'city-' + identifiant,    value: city}
                ]
            ];
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            if(context !== "commercial"){
                Formulaire.loader(true);
                let self = this;

                arrayBicSave = this.state.arrayBic;
                delete this.state.arrayBic;

                axios({ method: method, url: url, data: this.state })
                    .then(function (response) {
                        let data = response.data;
                        if(self.props.onUpdateList){
                            self.props.onUpdateList(data, context, "bank");
                        }
                        self.setState({ success: messageSuccess, errors: [] });
                        if(context === "create"){
                            self.setState( {
                                titulaire: '',
                                iban: '',
                                bic: '',
                            })
                        }
                    })
                    .catch(function (error) {
                        Formulaire.displayErrors(self, error);
                    })
                    .then(() => {
                        Formulaire.loader(false);
                    })
                ;
            }else{
                this.props.onBankCommercial(this.props.identifiant, this.state);
            }
        }
    }

    render () {
        const { context, identifiant } = this.props;
        const { errors, success, titulaire, iban, bic, address, zipcode, city, choice } = this.state;

        let formContent = <>
            {success !== false && <Alert type="info">{success}</Alert>}

            <div className="line">
                <Input valeur={iban} identifiant={"iban-" + identifiant} errors={errors} onChange={this.handleChange}>IBAN</Input>
            </div>

            <div className="line line-2">
                <Input valeur={bic} identifiant={"bic-" + identifiant} errors={errors} onChange={this.handleChange} >BIC</Input>
                <Input valeur={titulaire} identifiant={"titulaire-" + identifiant} errors={errors} onChange={this.handleChange} >Titulaire</Input>
            </div>

            {context === "commercial" && <>
                <div className="line line-3">
                    <Input valeur={address} identifiant={"address-" + identifiant} errors={errors} onChange={this.handleChange} >Adresse de facturation</Input>
                    <Input valeur={zipcode} identifiant={"zipcode-" + identifiant} errors={errors} onChange={this.handleChangeZipcodeCity} type="number">Code postal</Input>
                    <Input valeur={city} identifiant={"city-" + identifiant} errors={errors} onChange={this.handleChange} >Ville</Input>
                </div>
            </>}
        </>

        let radioboxItems = [
            { value: 0, label: 'Agence',    identifiant: 'agency-' + identifiant },
            { value: 1, label: 'Personnel', identifiant: 'personal-' + identifiant }
        ]

        return <>
            {context !== "commercial" ?<form onSubmit={this.handleSubmit}>
                {formContent}

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form> : <div>
                <div className="registration-choice">
                    <div className="line">
                        <Radiobox items={radioboxItems} identifiant={"choice-" + identifiant} valeur={choice} errors={errors} onChange={this.handleChange}>Quel compte utiliser ?</Radiobox>
                    </div>
                </div>
                {parseInt(choice) === 1 && <>
                    {formContent}
                    <div className="line">
                        <div className="form-button">
                            <Button onClick={this.handleSubmit}>Valider les informations</Button>
                            <Alert type="reverse">Si vous ne validez par ce formulaire, la banque d'agence sera sélectionné automatiquement.</Alert>
                        </div>
                    </div>
                </>}
            </div>}

        </>
    }
}
