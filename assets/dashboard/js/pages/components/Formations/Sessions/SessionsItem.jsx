import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import {ButtonIcon, ButtonIconDropdown} from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class SessionsItem extends Component {
    render () {
        const { elem, onChangeContext, onDelete, onSelectors, onSwitchPublished } = this.props

        let actions = [
            {data: <ButtonIcon element="a" icon="download" target="_blank"
                               onClick={Routing.generate('api_sessions_emargements', {'slug': elem.slug})}
                               text="Emargements" />},
            {data: <ButtonIcon element="a" icon="user"
                               onClick={Routing.generate('admin_sessions_read', {'slug': elem.slug})}
                               text="Participants" />},
        ]

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="name">
                                <span>{elem.animator}</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="sub" />
                        </div>
                        <div className="col-3 actions">
                            <ButtonIcon icon={elem.isPublished ? "vision" : "vision-not"} onClick={() => onSwitchPublished(elem)}>
                                {elem.isPublished ? "En ligne" : "Hors ligne"}
                            </ButtonIcon>
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                            <ButtonIconDropdown icon="menu" items={actions}>Autres</ButtonIconDropdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}