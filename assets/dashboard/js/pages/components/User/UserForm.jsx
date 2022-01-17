import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Checkbox }     from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Drop }                from "@dashboardComponents/Tools/Drop";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_users_create";
const URL_UPDATE_GROUP       = "api_users_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function UserFormulaire ({ type, onChangeContext, onUpdateList, element, isRegistration=false, roles=[] })
{
    let title = "Ajouter un utilisateur";
    let url = !isRegistration ? Routing.generate(URL_CREATE_ELEMENT) : Routing.generate(URL_CREATE_ELEMENT, {"n" : 1});
    let msg = !isRegistration ? "Félicitations ! Vous avez ajouté un nouveau utilisateur !"
        : "Félicitations, votre compte a été créé. Vous pouvez vous connecter à votre espace."

    if(type === "update" || type === "profil"){
        title = "Modifier " + element.username;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <Form
        context={type}
        url={url}
        username={element ? element.username : ""}
        firstname={element ? element.firstname : ""}
        lastname={element ? element.lastname : ""}
        email={element ? element.email : ""}
        avatar={element ? element.avatar : null}
        roles={element ? element.roles : roles}

        name={element ? element.agency.name : ""}
        phone={element ? element.agency.phone : ""}
        siren={element ? element.agency.siren : ""}
        garantie={element ? element.agency.garantie : ""}
        numCompta={element ? element.agency.numCompta : ""}
        nbFreeAca={element ? element.agency.nbFreeAca : ""}
        type={element ? element.agency.type : []}
        address={element ? element.agency.address : ""}
        zipcode={element ? element.agency.zipcode : ""}
        city={element ? element.agency.city : ""}
        firstname2={element ? element.agency.firstname2 : ""}
        lastname2={element ? element.agency.lastname2 : ""}
        firstname3={element ? element.agency.firstname3 : ""}
        lastname3={element ? element.agency.lastname3 : ""}

        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
        isRegistration={isRegistration}
    />

    return !isRegistration ? <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout> : form;
}

export class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: props.username,
            firstname: props.firstname,
            lastname: props.lastname,
            email: props.email,
            roles: props.roles,
            avatar: props.avatar,
            password: '',
            passwordConfirm: '',
            name: props.name,
            phone: props.phone,
            siren: props.siren,
            garantie: props.garantie,
            numCompta: props.numCompta,
            nbFreeAca: props.nbFreeAca,
            type: props.type,
            address: props.address,
            zipcode: props.zipcode,
            city: props.city,
            firstname2: props.firstname2,
            lastname2: props.lastname2,
            firstname3: props.firstname3,
            lastname3: props.lastname3,
            errors: [],
            success: false
        }

        this.inputAvatar = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
        let username = document.getElementById("username");
        if(username){ username.focus(); }
    }

    handleChange = (e) => {
        const { roles } = this.state

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "roles"){
            value = Formulaire.updateValueCheckbox(e, roles, value);
        }

        if(name === "type"){
            value = (e.currentTarget.checked) ? [parseInt(value)] : [] // parseInt because work with int this time
        }

        this.setState({[name]: value})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess, isRegistration } = this.props;
        const { username, firstname, lastname, password, passwordConfirm, email, roles } = this.state;

        this.setState({ success: false})

        let paramsToValidate = [
            {type: "text", id: 'username',  value: username},
            {type: "text", id: 'firstname', value: firstname},
            {type: "text", id: 'lastname',  value: lastname},
            {type: "email", id: 'email',    value: email},
            {type: "array", id: 'roles',    value: roles}
        ];
        if(context === "create" || context === "profil"){
            if(password !== "" || isRegistration){
                paramsToValidate = [...paramsToValidate,
                    ...[{type: "password", id: 'password', value: password, idCheck: 'passwordConfirm', valueCheck: passwordConfirm}]
                ];
            }
        }

        let inputAvatar = this.inputAvatar.current;
        let avatar = inputAvatar ? inputAvatar.drop.current.files : [];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();
            if(avatar[0]){
                formData.append('avatar', avatar[0].file);
            }

            formData.append("data", JSON.stringify(this.state));

            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    let data = response.data;
                    Helper.toTop();
                    if(self.props.onUpdateList){
                        self.props.onUpdateList(data);
                    }
                    self.setState({ success: messageSuccess, errors: [] });
                    if(context === "create"){
                        self.setState( {
                            username: '',
                            firstname: '',
                            lastname: '',
                            email: '',
                            roles: !isRegistration ? [] : ["ROLE_USER"],
                            password: '',
                            passwordConfirm: '',
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
        const { context, isRegistration } = this.props;
        const { errors, success, username, firstname, lastname, email, password, passwordConfirm, roles, avatar,
                name, phone, firstname2, lastname2, firstname3, lastname3, siren, garantie, numCompta, nbFreeAca,
            address, zipcode, city, type } = this.state;

        let rolesItems = [
            { value: 'ROLE_ADMIN', label: 'Admin',          identifiant: 'admin' },
            { value: 'ROLE_USER',  label: 'Utilisateur',    identifiant: 'utilisateur' },
        ]

        let switcherItems = [ { value: 0, label: 'Non', identifiant: 'non' } ]

        return <>
            {!isRegistration && <p className="form-infos">
                Le nom d'utilisateur est automatiquement formaté, les espaces et les accents sont supprimés ou
                remplacés.
            </p>}
            <form onSubmit={this.handleSubmit}>

                {success !== false && <div className="line">
                    <div className="form-group">
                        <Alert type="info">{success}</Alert>
                    </div>
                </div>}

                <div className="line line-2">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange} >Raison sociale</Input>
                    <Input valeur={phone} identifiant="phone" errors={errors} onChange={this.handleChange} >Téléphone</Input>
                </div>

                <div className={"line" + (context !== "profil" ? " line-2" : "")}>
                    {context !== "profil" && <Input valeur={username} identifiant="username" errors={errors} onChange={this.handleChange}>Nom utilisateur</Input>}
                    <Input valeur={email} identifiant="email" errors={errors} onChange={this.handleChange} type="email" >Adresse e-mail</Input>
                </div>

                <div className="line line-3">
                    <Input valeur={address} identifiant="address" errors={errors} onChange={this.handleChange}>Adresse</Input>
                    <Input valeur={zipcode} identifiant="zipcode" errors={errors} onChange={this.handleChange}>Code postal</Input>
                    <Input valeur={city} identifiant="city" errors={errors} onChange={this.handleChange}>Ville</Input>
                </div>

                <div className="line">
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Responsable(s)</div>
                        </div>
                    </div>

                    <div className="line line-3">
                        <Input valeur={firstname} identifiant="firstname" errors={errors} onChange={this.handleChange} >Prénom</Input>
                        <Input valeur={firstname2} identifiant="firstname2" errors={errors} onChange={this.handleChange} >Prénom 2</Input>
                        <Input valeur={firstname3} identifiant="firstname3" errors={errors} onChange={this.handleChange} >Prénom 3</Input>
                    </div>

                    <div className="line line-3">
                        <Input valeur={lastname} identifiant="lastname" errors={errors} onChange={this.handleChange} >Nom</Input>
                        <Input valeur={lastname2} identifiant="lastname2" errors={errors} onChange={this.handleChange} >Nom 2</Input>
                        <Input valeur={lastname3} identifiant="lastname3" errors={errors} onChange={this.handleChange} >Nom 3</Input>
                    </div>
                </div>

                <div className="line">
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Informations complémentaire</div>
                        </div>
                    </div>

                    <div className="line line-3">
                        <Input valeur={siren} identifiant="siren" errors={errors} onChange={this.handleChange} >SIREN</Input>
                        <Input valeur={garantie} identifiant="garantie" errors={errors} onChange={this.handleChange} >Caisse garantie</Input>
                        <Input valeur={numCompta} identifiant="numCompta" errors={errors} onChange={this.handleChange} >Numéro comptabilité</Input>
                    </div>

                    {context !== "profil" && <div className="line line-3">
                        <Checkbox isSwitcher={true} items={switcherItems} identifiant="type" valeur={type} errors={errors} onChange={this.handleChange}>Succursale ?</Checkbox>
                        <Input valeur={nbFreeAca} identifiant="nbFreeAca" errors={errors} onChange={this.handleChange} type="number">Gratuité académie</Input>
                        <div className="form-group" />
                    </div>}

                </div>

                {(context !== "profil" && !isRegistration) && <div className="line line-2">
                    <Checkbox items={rolesItems} identifiant="roles" valeur={roles} errors={errors} onChange={this.handleChange}>Roles</Checkbox>
                        : <div className="form-group" />

                    <Drop ref={this.inputAvatar} identifiant="avatar" file={avatar} folder="avatars" errors={errors} accept={"image/*"} maxFiles={1}
                          label="Téléverser un avatar" labelError="Seules les images sont acceptées.">Avatar (facultatif)</Drop>
                </div>}

                {(context === "create" || context === "profil") ? <>
                    {!isRegistration && <Alert type="reverse">
                        Laisser le champs vide génére un mot de passe aléatoire. L'utilisateur pourra utilise la
                        fonction <u>Mot de passe oublié ?</u> pour créer son mot de passe.
                    </Alert>}
                    <div className="line">
                        <PasswordRules />
                    </div>
                    <div className="line line-2">
                        <Input type="password" valeur={password} identifiant="password" errors={errors} onChange={this.handleChange} >Mot de passe {!isRegistration && "(facultatif)"}</Input>
                        <Input type="password" valeur={passwordConfirm} identifiant="passwordConfirm" errors={errors} onChange={this.handleChange} >Confirmer le mot de passe</Input>
                    </div>
                </> : <Alert type="warning">Le mot de passe est modifiable exclusivement par l'utilisateur lui même grâce à la fonction <u>Mot de passe oublié ?</u></Alert>}

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}

export function PasswordRules() {
    return <div className="password-rules">
        <p>Règles de création de mot de passe :</p>
        <ul>
            <li>Au moins 12 caractères</li>
            <li>Au moins 1 minuscule</li>
            <li>Au moins 1 majuscule</li>
            <li>Au moins 1 chiffre</li>
            <li>Au moins 1 caractère spécial</li>
        </ul>
    </div>
}