import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Radiobox, SelectizeMultiple } from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Trumb }               from "@dashboardComponents/Tools/Trumb";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_mails_create";
const URL_PREVIEW_ELEMENT    = "api_mails_preview";
const TXT_CREATE_BUTTON_FORM = "Envoyer";

export function MailFormulaire ({ type, users, dest })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Le message a été envoyé !"

    let form = <Form
        context={type}
        url={url}
        users={users}
        dest={JSON.parse(dest)}
        messageSuccess={msg}
    />

    return <div className="form">{form}</div>
}

export class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: 1,
            emails: [],
            aloneEmail: "",
            subject: "",
            title: "",
            message: {value: "", html: ""},
            errors: [],
            success: false
        }

        this.selectMultiple = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTrumb = this.handleChangeTrumb.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { dest } = this.props;
        Helper.toTop();

        if(dest){
            let emails = [];
            dest.forEach(el => {
                emails.push({ value: el, label: el, identifiant: el })
            })

            this.setState({ type: 1, emails })
        }
    }

    handleChange = (e) => {
        const { emails } = this.state;
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        let nEmails = emails

        if(name === "type"){
            nEmails = [];
        }

        if(name === "aloneEmail"){
            nEmails = [{identifiant: "alone", label: "Alone", value: value}];
        }

        this.setState({[name]: value, emails: nEmails})
    }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleChangeSelectMultipleAdd = (name, valeurs) => {
        this.setState({ [name]: valeurs })
        this.selectMultiple.current.handleUpdateValeurs(valeurs);
    }

    handleChangeSelectMultipleDel = (name, valeur) => {
        let valeurs = this.state.users.filter(v => v.value !== valeur.value);
        this.setState({ [name]: valeurs });
        this.selectMultiple.current.handleUpdateValeurs(valeurs);
    }

    handlePreview = (e) => {
        e.preventDefault();

        Formulaire.loader(true);
        let self = this;

        let formData = new FormData();
        formData.append("data", JSON.stringify(this.state));

        axios({ method: "POST", url: Routing.generate(URL_PREVIEW_ELEMENT), data: formData, headers: {'Content-Type': 'multipart/form-data'} })
            .then(function (response) {
                let preview = document.getElementById("preview");
                preview.innerHTML = response.data
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error);
            })
            .then(() => {
                Formulaire.loader(false);
            })
        ;
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;
        const { type, emails, aloneEmail, subject, title, message } = this.state;

        this.setState({ errors: [], success: false })

        let paramsToValidate = [
            {type: "text",  id: 'type',     value: type},
            {type: "text",  id: 'subject',  value: subject},
            {type: "text",  id: 'title',    value: title},
            {type: "text",  id: 'message',  value: message}
        ];

        if(parseInt(type) === 1){
            paramsToValidate = [...paramsToValidate,
                ...[{type: "array", id: 'emails', value: emails}]
            ];
        }else if(parseInt(type) === 2) {
            paramsToValidate = [...paramsToValidate,
                ...[{type: "text", id: 'aloneEmail', value: aloneEmail}]
            ];
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    Helper.toTop();
                    self.setState({ success: messageSuccess, errors: [] });
                    self.setState( {
                        type: 1,
                        emails: [],
                        aloneEmail: '',
                        subject: '',
                        title: '',
                        message: {value: "", html: ""},
                    })
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
        const { users, dest } = this.props;
        const { errors, success, type, emails, aloneEmail, subject, title, message } = this.state;

        let typeItems = [
            { value: 0,  label: 'Tout les utilisateurs',          identifiant: 'tlm' },
            { value: 1,  label: 'Sélectionner un utilisateur',    identifiant: 'utilisateur' },
            { value: 2,  label: 'Entrez une adresse e-mail',      identifiant: 'e-mail' },
        ]

        let selectUsers = [];
        if(users){
            JSON.parse(users).forEach(el => {
                if(el.getHighRoleCode !== 1){
                    selectUsers.push({ value: el.email, label: el.username, identifiant: 'us-' + el.id })
                }
            })
        }

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                {!dest ? <div className="line line-2">
                    <Radiobox items={typeItems} identifiant="type" valeur={type} errors={errors} onChange={this.handleChange}>Destinataire</Radiobox>
                    {parseInt(type) === 0 && <div className="form-group" />}
                    {parseInt(type) === 1 && <>
                        <SelectizeMultiple ref={this.selectMultiple} items={selectUsers} identifiant="emails" valeur={emails}
                                           placeholder={"Sélectionner un/des utilisateurs"}
                                           errors={errors}
                                           onChangeAdd={(e) => this.handleChangeSelectMultipleAdd("emails", e)}
                                           onChangeDel={(e) => this.handleChangeSelectMultipleDel("emails", e)}
                        >
                            Utilisateurs
                        </SelectizeMultiple>
                    </>}
                    {parseInt(type) === 2 && <>
                        <Input identifiant="aloneEmail" valeur={aloneEmail} errors={errors} onChange={this.handleChange} type="email">Email</Input>
                    </>}
                </div> : <div className="line">
                    <div className="form-group">
                        <label>Destinataire{dest.length > 1 ? "s" : "s"}</label>
                        <div>
                            {dest.map((el, index) => {
                                return <div key={index}>{el}</div>
                            })}
                        </div>
                    </div>
                </div>}

                <div className="line">
                    <Input identifiant="subject" valeur={subject} errors={errors} onChange={this.handleChange}>Objet</Input>
                </div>

                <div className="line line-2">
                    <Input identifiant="title" valeur={title} errors={errors} onChange={this.handleChange}>Titre du contenu</Input>
                    <div className="form-group" />
                </div>

                <div className="line">
                    <Trumb identifiant="message" valeur={message.value} errors={errors} onChange={this.handleChangeTrumb}>Message</Trumb>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={false} outline={true} type="default" onClick={this.handlePreview}>Prévisualisation</Button>
                        <Button isSubmit={true}>{TXT_CREATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}