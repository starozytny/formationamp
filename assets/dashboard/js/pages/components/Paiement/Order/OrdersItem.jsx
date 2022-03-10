import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

import Sanitaze      from "@commonComponents/functions/sanitaze";

export class OrdersItem extends Component {
    render () {
        const { isDeveloper, elem, onDelete, onSelectors, onCancel, onRefresh, onProcess } = this.props

        return <div className="item">
            {isDeveloper && <Selector id={elem.id} onSelectors={onSelectors} />}

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <InfosOrder elem={elem} />
                        <div className="col-3">
                            <div className={"badge-order badge badge-" + elem.status}>{elem.statusString}</div>
                            <div className="sub">{elem.createdAtString}</div>
                        </div>
                        <div className="col-4 actions">
                            {elem.status === 0 && <ButtonIcon icon="refresh" onClick={() => onRefresh(elem)}>Rafraichir</ButtonIcon>}
                            {elem.status === 1 && <ButtonIcon icon="upload" onClick={() => onProcess(elem.id, elem.name)}>Traiter</ButtonIcon>}
                            {(elem.status === 0 || elem.status === 1) && <ButtonIcon icon="cancel" onClick={() => onCancel(elem)}>Annuler</ButtonIcon>}
                            {(isDeveloper && (elem.status === 3 || elem.status === 4)) && <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export function InfosOrder({ elem }) {
    return <>
        <div className="col-1">
            <div className="name">
                <span>{elem.name}</span>
            </div>
            <div className="sub">{elem.email}</div>
            <div className="sub">{elem.ibanHidden}</div>
            <div className="sub">{elem.bic}</div>
            <div className="sub">{elem.titulaire}</div>
        </div>
        <div className="col-2">
            <div>{Sanitaze.toFormatCurrency(elem.price)}</div>
            <div className="sub">{elem.participants} pers.</div>
        </div>
    </>
}
