import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }       from "@dashboardComponents/Tools/Button";

import { Form }         from "@dashboardPages/components/User/UserForm";
import {FormLayout} from "@dashboardComponents/Layout/Elements";
import Formulaire from "@dashboardComponents/functions/Formulaire";

const URL_UPDATE_GROUP  = "api_users_update";

export function UserFormulaire ({ type, element })
{
    let title = "Modifier " + element.username;
    let url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    let msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";

    let form = <Form
        context={type}
        url={url}
        username={element ? Formulaire.setValueEmptyIfNull(element.username) : ""}
        firstname={element ? Formulaire.setValueEmptyIfNull(element.firstname) : ""}
        lastname={element ? Formulaire.setValueEmptyIfNull(element.lastname) : ""}
        email={element ? Formulaire.setValueEmptyIfNull(element.email) : ""}
        avatar={element ? Formulaire.setValueEmptyIfNull(element.avatar, null) : null}
        roles={element ? Formulaire.setValueEmptyIfNull(element.roles, ["ROLE_USER"]) : ["ROLE_USER"]}

        name={element ? Formulaire.setValueEmptyIfNull(element.agency.name) : ""}
        phone={element ? Formulaire.setValueEmptyIfNull(element.agency.phone) : ""}
        siren={element ? Formulaire.setValueEmptyIfNull(element.agency.siren) : ""}
        garantie={element ? Formulaire.setValueEmptyIfNull(element.agency.garantie) : ""}
        numCompta={element ? Formulaire.setValueEmptyIfNull(element.agency.numCompta) : ""}
        nbFreeAca={element ? Formulaire.setValueEmptyIfNull(element.agency.nbFreeAca) : ""}
        type={element ? Formulaire.setValueEmptyIfNull(element.agency.type, []) : []}
        address={element ? Formulaire.setValueEmptyIfNull(element.agency.address) : ""}
        zipcode={element ? Formulaire.setValueEmptyIfNull(element.agency.zipcode) : ""}
        city={element ? Formulaire.setValueEmptyIfNull(element.agency.city) : ""}
        firstname2={element ? Formulaire.setValueEmptyIfNull(element.agency.firstname2) : ""}
        lastname2={element ? Formulaire.setValueEmptyIfNull(element.agency.lastname2) : ""}
        firstname3={element ? Formulaire.setValueEmptyIfNull(element.agency.firstname3) : ""}
        lastname3={element ? Formulaire.setValueEmptyIfNull(element.agency.lastname3) : ""}
        messageSuccess={msg}
    />

    return <FormLayout url={Routing.generate('user_profil')} form={form} text="Retour à mon profil">{title}</FormLayout>
}