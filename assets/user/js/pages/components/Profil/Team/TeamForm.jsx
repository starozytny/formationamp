import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Radiobox }       from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_team_create";
const URL_UPDATE_GROUP       = "api_team_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function TeamFormulaire ({ type, element })
{
    let title = "Ajouter un membre";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitation ! Vous avez ajouté un nouveau membre !"

    if(type === "update"){
        title = "Modifier " + element.id;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <Form
        context={type}
        url={url}
        firstname={element ? element.firstname : ""}
        lastname={element ? element.lastname : ""}
        type={element ? element.type : 0}
        messageSuccess={msg}
    />

    return <FormLayout url={Routing.generate('user_profil')} form={form} text="Retour à mon profil">{title}</FormLayout>
}

export class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstname: props.firstname,
            lastname: props.lastname,
            type: props.type,
            errors: [],
            success: false
        }

        this.inputAvatar = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        this.setState({[name]: value})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { firstname, lastname, type } = this.state;

        this.setState({ success: false})

        let method = context === "create" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text", id: 'firstname', value: firstname},
            {type: "text", id: 'lastname',  value: lastname},
            {type: "text", id: 'type',    value: type}
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;
            axios({ method: method, url: url, data: this.state })
                .then(function (response) {
                    let data = response.data;
                    self.setState({ success: messageSuccess, errors: [] });
                    if(context === "create"){
                        self.setState( {
                            firstname: '',
                            lastname: '',
                            type: 0
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
        const { errors, success, firstname, lastname, type } = this.state;

        let typeItems = [
            { value: 0, label: 'Salarié',           identifiant: 'salarie' },
            { value: 1, label: 'Non salarié',       identifiant: 'no-salarie' },
            { value: 2, label: 'Agent commercial',  identifiant: 'agent-co' },
            { value: 3, label: 'Responsable',       identifiant: 'responsable' },
        ]

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <Input valeur={firstname} identifiant="firstname" errors={errors} onChange={this.handleChange} >Prénom</Input>
                    <Input valeur={lastname} identifiant="lastname" errors={errors} onChange={this.handleChange} >Nom</Input>
                </div>

                <div className="line">
                    <Radiobox items={typeItems} identifiant="type" valeur={type} errors={errors} onChange={this.handleChange}>Type de membre</Radiobox>
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