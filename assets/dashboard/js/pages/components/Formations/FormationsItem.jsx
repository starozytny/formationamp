import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Selector }           from "@dashboardComponents/Layout/Selector";

import helper                 from "@dashboardPages/components/Formations/helper";

export class FormationsItem extends Component {
    render () {
        const { elem, onChangeContext, onDelete, onSelectors, onSwitchPublished } = this.props

        let categories = helper.getCategoriesString(elem.categories);

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1">
                            <div className="name">
                                <span>{elem.name}</span>
                            </div>
                            {elem.rating && <div className="rating">{elem.rating} <span className="icon-star-2" /></div> }
                        </div>
                        <div className="col-2">
                            <div className="badges">
                                {categories.map((cat, index) => {
                                    return <div className="badge" key={index}>{cat}</div>
                                })}
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="sub">
                                <Button element="a" onClick={Routing.generate('admin_sessions_index', {'slug': elem.slug})} >Sessions</Button>
                            </div>
                        </div>
                        <div className="col-4 actions">
                            <ButtonIcon icon={elem.isPublished ? "vision" : "vision-not"} onClick={() => onSwitchPublished(elem)}>
                                {elem.isPublished ? "En ligne" : "Hors ligne"}
                            </ButtonIcon>
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}