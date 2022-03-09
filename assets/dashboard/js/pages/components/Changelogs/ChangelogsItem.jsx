import React, { Component } from 'react';

import parse from "html-react-parser";

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class ChangelogsItem extends Component {
    render () {
        const { elem, onChangeContext, onDelete, onSelectors, onSwitchPublished } = this.props

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="name">
                                <span className={"badge-changelog badge badge-" + elem.type}>
                                    <span className={"icon-" + elem.typeIcon} />
                                    <span className="tooltip">{elem.typeString}</span>
                                </span>
                                <span>{elem.name}</span>
                            </div>
                            <div className="sub">{elem.createdAtString}</div>
                        </div>
                        <div className="col-2">
                            <div className="sub">{elem.content ? parse(elem.content) : null}</div>
                        </div>
                        <div className="col-3 actions">
                            <div className={"btn-isPublished " + elem.isPublished}>
                                <ButtonIcon icon="alarm" onClick={() => onSwitchPublished(elem)}>{elem.isPublished ? "Cacher" : "Publier"}</ButtonIcon>
                            </div>
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}