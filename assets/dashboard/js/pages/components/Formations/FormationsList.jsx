import React, { Component } from 'react';

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Alert }              from "@dashboardComponents/Tools/Alert";

import { FormationsItem }     from "./FormationsItem";

export class FormationsList extends Component {
    render () {
        const { data, onChangeContext, onDeleteAll } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter une formation</Button>
                    </div>
                </div>

                <div className="items-table">
                    <div className="items items-default items-contact">
                        <div className="item item-header">
                            <div className="item-header-selector" />
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-4">
                                        <div className="col-1">Intitulé</div>
                                        <div className="col-2">Catégories</div>
                                        <div className="col-3">Sessions</div>
                                        <div className="col-4 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <FormationsItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>

                <div className="page-actions">
                    <div className="selectors-actions">
                        <div className="item" onClick={onDeleteAll}>
                            <ButtonIcon icon="trash" text="Supprimer la sélection" />
                        </div>
                    </div>
                </div>

            </div>
        </>
    }
}