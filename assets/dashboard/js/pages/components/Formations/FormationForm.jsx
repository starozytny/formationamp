import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Checkbox, Input, Select } from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Trumb }               from "@dashboardComponents/Tools/Trumb";
import { Drop }                from "@dashboardComponents/Tools/Drop";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import helper                  from "./helper";

const URL_CREATE_ELEMENT     = "api_formations_create";
const URL_UPDATE_GROUP       = "api_formations_update";
const TXT_CREATE_BUTTON_FORM = "Ajouter la formation";
const TXT_UPDATE_BUTTON_FORM = "Modifier la formation";

export function FormationsFormulaire ({ type, onChangeContext, onUpdateList, element })
{
    let title = "Ajouter une formation";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitation ! Vous avez ajouté une nouvelle formation !"

    if(type === "update"){
        title = "Modifier " + element.name;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisé avec succès !";
    }

    let form = <FormationForm
        context={type}
        url={url}
        name={element ? Formulaire.setValueEmptyIfNull(element.name) : ""}
        content={element ? Formulaire.setValueEmptyIfNull(element.content) : ""}
        prerequis={element ? Formulaire.setValueEmptyIfNull(element.prerequis) : ""}
        goals={element ? Formulaire.setValueEmptyIfNull(element.goals) : ""}
        aptitudes={element ? Formulaire.setValueEmptyIfNull(element.aptitudes) : ""}
        skills={element ? Formulaire.setValueEmptyIfNull(element.skills) : ""}
        target={element ? Formulaire.setValueEmptyIfNull(element.target) : ""}
        cat={element ? Formulaire.setValueEmptyIfNull(element.cat) : ""}
        isAca={element ? Formulaire.setValueEmptyIfNull(element.isAca ? 1 : 0, 0) : 0}
        accessibility={element ? Formulaire.setValueEmptyIfNull(element.accessibility, 0) : 0}
        categories={element ? Formulaire.setValueEmptyIfNull(element.categories, []) : []}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class FormationForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            price: props.price,
            content: { value: props.content ? props.content : "", html: props.content ? props.content : "" },
            prerequis: { value: props.prerequis ? props.prerequis : "", html: props.prerequis ? props.prerequis : "" },
            goals: { value: props.goals ? props.goals : "", html: props.goals ? props.goals : "" },
            aptitudes: { value: props.aptitudes ? props.aptitudes : "", html: props.aptitudes ? props.aptitudes : "" },
            skills: { value: props.skills ? props.skills : "", html: props.skills ? props.skills : "" },
            target: { value: props.target ? props.target : "", html: props.target ? props.target : "" },
            cat: { value: props.cat ? props.cat : "", html: props.cat ? props.cat : "" },
            isAca: [props.isAca],
            categories: props.categories,
            accessibility: props.accessibility,
            errors: [],
            success: false
        }

        this.inputProg = React.createRef();
        this.inputSupp = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeTrumb = this.handleChangeTrumb.bind(this);
    }


    componentDidMount() {
        Helper.toTop();
        document.getElementById("name").focus()
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "categories"){
            value = Formulaire.updateValueCheckbox(e, this.state.categories, parseInt(value));
        }

        if(name === "isAca"){
            value = (e.currentTarget.checked) ? [parseInt(value)] : [];
        }

        this.setState({[name]: value})
    }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { name } = this.state;

        this.setState({ errors: [], success: false })

        let programme = this.inputProg.current.drop.current.files;
        let support = this.inputSupp.current.drop.current.files;

        let paramsToValidate = [
            {type: "text", id: 'name',  value: name}
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            if(programme[0]){
                formData.append('programme', programme[0].file);
            }
            if(support[0]){
                formData.append('support', support[0].file);
            }

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
                            name: '',
                            content: { value: "", html: "" },
                            prerequis: { value: "", html: ""},
                            goals: { value: "", html: ""},
                            aptitudes: { value: "", html: ""},
                            skills: { value: "", html: ""},
                            target: { value: "", html: ""},
                            cat: { value: "", html: ""},
                            accessibility: 0,
                            isAca: [0]
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
        const { errors, success, name, content, prerequis, goals, aptitudes, skills, target, cat, accessibility, categories, isAca } = this.state;

        let selectItems = [
            { value: 0, label: 'Bâtiment non conforme', identifiant: 'bat-not-conforme' },
            { value: 1, label: 'Bâtiment conforme', identifiant: 'bat-conforme' },
        ]

        let switcherItems = [ { value: 1, label: 'Oui', identifiant: 'oui' } ]

        let categoriesItems = helper.getCategories();

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange} >Intitulé</Input>
                    <Checkbox isSwitcher={true} items={switcherItems} identifiant="isAca" valeur={isAca}
                              errors={errors} onChange={this.handleChange}>
                        Est-ce une académie ?
                    </Checkbox>
                </div>
                <div className="line line-2">
                    <Select items={selectItems} identifiant="accessibility" valeur={accessibility} errors={errors} onChange={this.handleChange} noEmpty={true}>Accessibilité handicapé ?</Select>
                    <Checkbox items={categoriesItems} identifiant="categories" valeur={categories} errors={errors} onChange={this.handleChange}>Catégories</Checkbox>
                </div>

                <div className="line">
                    <Trumb identifiant="content" valeur={content.value} errors={errors} onChange={this.handleChangeTrumb}>Description</Trumb>
                </div>

                <div className="line line-2">
                    <Trumb identifiant="prerequis" valeur={prerequis.value} errors={errors} onChange={this.handleChangeTrumb}>Prérequis</Trumb>
                    <Trumb identifiant="goals" valeur={goals.value} errors={errors} onChange={this.handleChangeTrumb}>Objectifs</Trumb>
                </div>

                <div className="line line-2">
                    <Trumb identifiant="aptitudes" valeur={aptitudes.value} errors={errors} onChange={this.handleChangeTrumb}>Aptitudes</Trumb>
                    <Trumb identifiant="skills" valeur={skills.value} errors={errors} onChange={this.handleChangeTrumb}>Compétences</Trumb>
                </div>

                <div className="line line-2">
                    <Trumb identifiant="target" valeur={target.value} errors={errors} onChange={this.handleChangeTrumb}>Public cible</Trumb>
                    <Trumb identifiant="cat" valeur={cat.value} errors={errors} onChange={this.handleChangeTrumb}>Catégorie de formation</Trumb>
                </div>

                <div className="line line-2">
                    <Drop ref={this.inputProg} identifiant="programme" errors={errors} accept={"*"} maxFiles={1}
                          label="Téléverser un programme" labelError="Erreur.">Fichier programme</Drop>
                    <Drop ref={this.inputSupp} identifiant="support" errors={errors} accept={"*"} maxFiles={1}
                          label="Téléverser un support" labelError="Erreur.">Fichier support</Drop>
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
