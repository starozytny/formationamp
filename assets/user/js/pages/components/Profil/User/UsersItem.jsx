import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

export class UsersItem extends Component {
    render () {
        const { id, isUser, elem, onDelete } = this.props;

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="name">
                                <span>{elem.lastname} {elem.firstname}</span>
                                <div className="role">{elem.highRole}</div>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="sub">{elem.username}</div>
                            <div className="sub">{elem.email}</div>
                        </div>
                        <div className="col-3 actions">
                            {(id !== elem.id && !isUser && elem.highRoleCode !== 1 && elem.highRoleCode !== 2) && <>
                                <ButtonIcon icon="pencil" onClick={Routing.generate('user_user_update', {'username': elem.username})} element="a">Modifier</ButtonIcon>
                                <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}