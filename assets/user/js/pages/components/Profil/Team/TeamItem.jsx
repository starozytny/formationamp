import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

export class TeamItem extends Component {
    render () {
        const { elem, onDelete, onSwitchArchived } = this.props;

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="name">
                                <span>{elem.lastname} {elem.firstname}</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="sub"><div className="role">{elem.typeString}</div></div>
                        </div>
                        <div className="col-3 actions">
                            <ButtonIcon icon={elem.isArchived ? "like" : "briefcase"} onClick={() => onSwitchArchived(elem)}>{elem.isArchived ? "Réaffecter" : "Archiver"}</ButtonIcon>
                            {elem.isArchived === false &&
                                <>
                                    <ButtonIcon icon="pencil" element="a" onClick={Routing.generate('user_team_update', {'id': elem.id})}>Modifier</ButtonIcon>
                                    <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}