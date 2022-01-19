import React, { Component } from 'react';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon } from "@dashboardComponents/Tools/Button";

import Sanitaze from "@commonComponents/functions/sanitaze";
import helper   from "@dashboardPages/components/Formations/helper";

export class SessionsItem extends Component {
    render () {
        const { isFromApp, elem } = this.props;

        let participants = elem.registrations.length + " / " + elem.max + " pers.";

        let categories = helper.getCategoriesString(elem.formation.categories);

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1">
                            <div className="name">{elem.formation.name}</div>
                            <div className="sub">
                                <span>{elem.fullDate}</span>
                            </div>
                            <div className="sub date">{elem.time} {elem.time && elem.time2 ? " - " : ""} {elem.time2}</div>
                            <div className="sub"><span className="icon-user" /> {elem.animator}</div>
                        </div>
                        <div className="col-2">
                            <div className="badge">{elem.typeString}</div>
                            <div className="sub">{Sanitaze.toFormatCurrency(elem.priceTTC)} TTC / unité</div>
                            <div className="sub">{participants}</div>
                        </div>
                        <div className="col-3">
                            <div className="badges">
                                {categories.map((cat, index) => {
                                    return <div className="badge" key={index}>{cat}</div>
                                })}
                            </div>
                        </div>
                        <div className="col-4 actions">
                            {!isFromApp && <>
                                <ButtonIcon element="a" icon="download" onClick={Routing.generate('user_formation_registration', {'slug': elem.slug})}>
                                    S'inscrire
                                </ButtonIcon>
                                <ButtonIcon element="a" icon="vision" onClick={Routing.generate('user_formation_read', {'slug': elem.slug})}>
                                    Détails
                                </ButtonIcon>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}