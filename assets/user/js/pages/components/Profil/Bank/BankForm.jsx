import React, { Component } from 'react';

import axios                from "axios";
import Routing              from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }           from "@dashboardComponents/Tools/Button";
import { Alert }            from "@dashboardComponents/Tools/Alert";
import { Input }            from "@dashboardComponents/Tools/Fields";

import Formulaire           from "@dashboardComponents/functions/Formulaire";
import Validateur           from "@commonComponents/functions/validateur";
import Sanitaze             from "@commonComponents/functions/sanitaze";
import Helper               from "@commonComponents/functions/helper";

const URL_CREATE_ELEMENT     = "api_banks_create";
const URL_UPDATE_GROUP       = "api_banks_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

let arrayBicSave = [];

export function BankFormulaire ({ type, element })
{
    let title = "Ajouter un RIB";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitation ! Vous avez ajouté un nouveau RIB !"

    if(type === "update" || type === "profil"){
        title = "Modifier " + element.id;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <Form
        context={type}
        url={url}
        titulaire={element ? element.titulaire : ""}
        iban={element ? element.iban : ""}
        bic={element ? element.bic : ""}
        messageSuccess={msg}
    />

    return <>
        <div className="toolbar">
            <div className="item">
                <Button element="a" outline={true} icon="left-arrow" type="primary" onClick={Routing.generate('user_profil')}>Retour à mon profil</Button>
            </div>
        </div>

        <div className="form">
            <h2>{title}</h2>
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
            errors: [],
            arrayBic: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

        Helper.getBicCodes(this);
    }

    handleChange = (e) => {
        const { arrayBic } = this.state;

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "iban"){
            value = Sanitaze.toFormatIban(value);

            Helper.setBicFromIban(this, value, arrayBic ? arrayBic : arrayBicSave)
        }

        this.setState({[name]: value.toUpperCase()})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { titulaire, iban, bic } = this.state;

        this.setState({ success: false})

        let method = context === "create" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text", id: 'titulaire',  value: titulaire},
            {type: "iban", id: 'iban',       value: iban},
            {type: "text", id: 'bic',        value: bic},
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;

            arrayBicSave = this.state.arrayBic;
            delete this.state.arrayBic;

            axios({ method: method, url: url, data: this.state })
                .then(function (response) {
                    let data = response.data;
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
        }
    }

    render () {
        const { context } = this.props;
        const { errors, success, titulaire, iban, bic } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input valeur={iban} identifiant="iban" errors={errors} onChange={this.handleChange}>IBAN</Input>
                </div>

                <div className="line line-2">
                    <Input valeur={bic} identifiant="bic" errors={errors} onChange={this.handleChange} >BIC</Input>
                    <Input valeur={titulaire} identifiant="titulaire" errors={errors} onChange={this.handleChange} >Titulaire</Input>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}