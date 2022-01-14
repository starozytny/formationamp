import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }       from "@dashboardComponents/Tools/Button";

import { Form }         from "@dashboardPages/components/User/UserForm";
import {FormLayout} from "@dashboardComponents/Layout/Elements";

const URL_UPDATE_GROUP  = "api_users_update";

export function UserFormulaire ({ type, element })
{
    let title = "Modifier " + element.username;
    let url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    let msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";

    let form = <Form
        context={type}
        url={url}
        username={element ? element.username : ""}
        firstname={element ? element.firstname : ""}
        lastname={element ? element.lastname : ""}
        email={element ? element.email : ""}
        avatar={element ? element.avatar : null}
        roles={element ? element.roles : []}
        messageSuccess={msg}
    />

    return <FormLayout url={Routing.generate('user_profil')} form={form} text="Retour à mon profil">{title}</FormLayout>
}