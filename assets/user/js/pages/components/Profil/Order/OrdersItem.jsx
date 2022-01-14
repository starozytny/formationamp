import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

import Sanitaze         from "@commonComponents/functions/sanitaze";

export class OrdersItem extends Component {
    render () {
        const { elem, onCancel } = this.props

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1">
                            <div className="name">
                                <span>{elem.name}</span>
                            </div>
                            <div className="sub">{elem.createdAtString}</div>
                        </div>
                        <div className="col-2">
                            <div>{Sanitaze.toFormatCurrency(elem.price)}</div>
                            <div className="sub">{elem.participants} pers.</div>
                        </div>
                        <div className="col-3">
                            <div className="role">{elem.statusString}</div>
                        </div>
                        <div className="col-4 actions">
                            {(elem.status === 1 || elem.status === 2) &&
                                <ButtonIcon icon="file" element="a" target="_blank"
                                            onClick={Routing.generate('api_orders_mandat', {'id': elem.id})}>
                                    Mandat de prélèvement
                                </ButtonIcon>
                            }
                            {(elem.status === 0 || elem.status === 1) && <ButtonIcon icon="cancel" onClick={() => onCancel(elem)}>Annuler</ButtonIcon>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}