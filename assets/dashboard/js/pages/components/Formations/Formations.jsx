import React, { Component } from 'react';

import axios             from "axios";
import toastr            from "toastr";
import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@dashboardComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { FormationsList }       from "./FormationsList";
import { FormationsRead }       from "./FormationsRead";
import { FormationsFormulaire } from "./FormationsForm";

const URL_DELETE_ELEMENT = 'api_formations_delete';
const URL_DELETE_GROUP = 'api_formations_delete_group';
const MSG_DELETE_ELEMENT = 'Supprimer cette formation ?';
const MSG_DELETE_GROUP = 'Aucune formation sélectionnée.';
const URL_SWITCH_PUBLISHED = 'api_formations_formation_published';
const MSG_SWITCH_PUBLISHED = 'Formation';
const SORTER = Sort.compareCreatedAt;

export class Formations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            sessionName: "formations.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
        this.handleSwitchPublished = this.handleSwitchPublished.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
        this.handleContentRead = this.handleContentRead.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees, SORTER); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext, SORTER); }

    handleDelete = (element) => {
        this.layout.current.handleDelete(this, element, Routing.generate(URL_DELETE_ELEMENT, {'id': element.id}), MSG_DELETE_ELEMENT);
    }

    handleDeleteGroup = () => {
        this.layout.current.handleDeleteGroup(this, Routing.generate(URL_DELETE_GROUP), MSG_DELETE_GROUP);
    }

    handleSwitchPublished = (element) => {
        this.layout.current.handleSwitchPublished(this, element, Routing.generate(URL_SWITCH_PUBLISHED, {'id': element.id}), MSG_SWITCH_PUBLISHED);
    }

    handleContentList = (currentData, changeContext) => {
        return <FormationsList onChangeContext={changeContext}
                               onDelete={this.handleDelete}
                               onDeleteAll={this.handleDeleteGroup}
                               onSwitchPublished={this.handleSwitchPublished}
                               data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <FormationsFormulaire type="create" onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <FormationsFormulaire type="update" element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentRead = (changeContext, element) => {
        return <FormationsRead element={element} onChangeContext={changeContext}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList} onContentRead={this.handleContentRead}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate} />
        </>
    }
}