import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

import Sanitaze         from "@commonComponents/functions/sanitaze";

export class BanksItem extends Component {
    render () {
        const { isRegistration, elem, onDelete, onSwitchMain, bank, onSelectBank, onOpenAside } = this.props

        return <div className="item">
            {isRegistration && <div className="selector" onClick={() => onSelectBank(elem)}>
                <label className={"item-selector " + (bank && bank.id === elem.id)} />
            </div>}
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1" onClick={onSelectBank ? () => onSelectBank(elem) : null}>
                            <div className="name">
                                <span>{Sanitaze.toFormatIbanHidden(elem.iban)}</span>
                            </div>
                            {!isRegistration && <div className="role">
                                <span>{elem.isMain ? "Principal" : "Secondaire" }</span>
                                {!elem.isMain && <span className="icon-star-2" onClick={() => onSwitchMain(elem)}/>}
                            </div>}
                        </div>
                        <div className="col-2" onClick={onSelectBank ? () => onSelectBank(elem) : null}>
                            <div className="sub">{elem.titulaire}</div>
                            <div className="sub">{elem.bic}</div>
                        </div>
                        <div className="col-3 actions">
                            {!isRegistration ? <ButtonIcon icon="pencil" element="a" onClick={Routing.generate('user_bank_update', {'id': elem.id})}>Modifier</ButtonIcon>
                                : <ButtonIcon icon="pencil" onClick={() => onOpenAside("update", elem)}>Modifier</ButtonIcon>}
                            {(!bank || bank.id !== elem.id) && <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}