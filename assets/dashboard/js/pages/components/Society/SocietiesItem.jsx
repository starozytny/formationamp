import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class SocietiesItem extends Component {
    render () {
        const { developer, elem, users, onChangeContext, onSelectors, onDelete } = this.props;

        let total = 0;
        users.forEach(user => {
            if(user.society.id === elem.id){
                total++;
            }
        })

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body item-body-image">
                    <div className="item-image" onClick={() => onChangeContext('read', elem)}>
                        <img src={elem.logoFile} alt={`Logo de ${elem.name}`}/>
                    </div>
                    <div className="infos infos-col-3">
                        <div className="col-1" onClick={() => onChangeContext('read', elem)}>
                            <div className="name">
                                <span>{elem.name} - {elem.formeString}</span>
                            </div>
                            <span className="badge">#{elem.codeString}</span>
                        </div>
                        <div className="col-2" onClick={() => onChangeContext('read', elem)}>
                            <div className="sub">{total} utilisateur{total > 1 ? "s" : ""}</div>
                        </div>
                        <div className="col-3 actions">
                            {developer === 1 && <>
                                <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                                <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
