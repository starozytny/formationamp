import React, { Component } from 'react';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon } from "@dashboardComponents/Tools/Button";

import Sanitaze from "@commonComponents/functions/sanitaze";

export class SessionsItem extends Component {
    render () {
        const { elem } = this.props;

        let participants = elem.registrations.length + " / " + elem.max + " pers.";

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
                        </div>
                        <div className="col-4 actions">
                            <ButtonIcon element="a" onClick={Routing.generate('user_registration', {'slug': elem.slug})} icon="download">S'inscrire</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}