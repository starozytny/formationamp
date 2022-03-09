import React, { Component } from 'react';

import { ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Back } from "@dashboardComponents/Layout/Elements";

export class UserRead extends Component {
    render () {
        const { elem, onChangeContext, onRegenPassword } = this.props;

        return <>
            <div>
                <Back onChangeContext={onChangeContext} />

                <div className="item-read">

                    <div className="item-read-infos">
                        <div className="actions">
                            <ButtonIcon icon="refresh" tooltipWidth={160} onClick={() => onRegenPassword(elem)}>Réinitialiser son mot de passe</ButtonIcon>
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext('update', elem)} >Modifier</ButtonIcon>
                        </div>
                        <div className="item-read-infos-container">
                            <div className="avatar">
                                <img src={elem.avatarFile} alt={`Avatar de ${elem.username}`}/>
                            </div>

                            <div className="main-infos">
                                <div className="name">
                                    <div>#{elem.id}</div>
                                    <span>{elem.lastname.toUpperCase()} {elem.firstname}</span>
                                </div>
                                <div className="username">
                                    <span>({elem.username})</span>
                                </div>
                                <div className="sub">{elem.email}</div>
                            </div>

                            <div className="footer-infos">
                                <div className="role role-time">Membre depuis le {elem.createdAtString}</div>
                                <div className="role">{elem.highRole}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    }
}