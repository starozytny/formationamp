import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import {SelectReactSelectize} from "@dashboardComponents/Tools/Fields";

export class TeamItem extends Component {
    render () {
        const { elem, onDelete, onSwitchArchived } = this.props;

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="name">
                                <span>{elem.lastname} {elem.firstname}</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="sub"><div className={"badge badge-" + elem.type}>{elem.typeString}</div></div>
                        </div>
                        <div className="col-3 actions">
                            <ButtonIcon icon={elem.isArchived ? "like" : "briefcase"} onClick={() => onSwitchArchived(elem)}>{elem.isArchived ? "Réaffecter" : "Archiver"}</ButtonIcon>
                            {elem.isArchived === false &&
                                <>
                                    <ButtonIcon icon="pencil" element="a" onClick={Routing.generate('user_team_update', {'id': elem.id})}>Modifier</ButtonIcon>
                                    <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export class TeamItemRegistration extends Component {
    render () {
        const { elem, onSelectWorker, workers, workersRegistered } = this.props;

        let active = false;
        workers.forEach(item => {
            if(item.id === elem.id){
                active = true;
            }
        })

        let disabled = false;
        workersRegistered.forEach(item => {
            if(item.id === elem.id){
                disabled = true;
            }
        })

        return <div className={"item item-disabled-" + disabled} onClick={disabled ? null : () => onSelectWorker(elem)}>
            <div className="selector">
                <label className={"item-selector " + active} />
            </div>

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1" >
                            <div className="name">
                                <span>{elem.lastname} {elem.firstname}</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className={"badge badge-" + elem.type}>{elem.typeString}</div>
                        </div>
                        <div className="col-3 actions">
                            <div className="sub">{active ? "Sélectionné(e)" : ""}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export class TeamItemRegistrationUpdate extends Component {
    render () {
        const { registration, elem, registrations, allWorkers, onChangeSelect, worker, errors, onTrash, registrationsToDelete } = this.props;

        console.log(registrations)

        let alreadySelected = [];
        registrations.forEach(item => {
            alreadySelected.push(item.worker.id);
        })

        let selectWorkers = [];
        allWorkers.forEach(el => {
            if(!alreadySelected.includes(el.id)){
                selectWorkers.push({ value: el.id, label: el.lastname + " " + el.firstname, identifiant: 'wo-' + el.id  })
            }
        })

        let isDeleted = false;
        registrationsToDelete.forEach(el => {
            if(el.id === registration.id){
                isDeleted = true;
            }
        })

        return <div className={"item item-deleted-" + isDeleted}>
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className={"badge badge-" + elem.type}>{elem.typeString}</div>
                            <div className="name">
                                <span>{elem.lastname} {elem.firstname}</span>
                            </div>
                        </div>
                        <div className="col-2">
                            {!isDeleted && <SelectReactSelectize items={selectWorkers} identifiant="worker" placeholder={"Sélectionner un remplaçant"}
                                                                 valeur={worker} errors={errors} onChange={(e) => onChangeSelect(registration, elem, e)}>
                            </SelectReactSelectize>}
                        </div>
                        <div className="col-3 actions">
                            {!isDeleted ? <ButtonIcon icon="trash" onClick={() => onTrash(registration)}>Enlever</ButtonIcon>
                                : <ButtonIcon icon="refresh" onClick={() => onTrash(registration)}>Restaurer</ButtonIcon>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
