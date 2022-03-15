import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { FormationsList }       from "./FormationsList";
import { FormationsFormulaire } from "./FormationForm";

const URL_DELETE_ELEMENT    = 'api_formations_delete';
const URL_DELETE_GROUP      = 'api_formations_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer cette formation ?';
const MSG_DELETE_GROUP      = 'Aucune formation sélectionnée.';
const URL_SWITCH_PUBLISHED  = 'api_formations_formation_published';
const MSG_SWITCH_PUBLISHED  = 'Formation';
const SORTER = Sort.compareCreatedAtInverse;

export class Formations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            pathDeleteGroup: URL_DELETE_GROUP,
            msgDeleteGroup: MSG_DELETE_GROUP,
            sessionName: "formations.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSwitchPublished = this.handleSwitchPublished.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSwitchPublished = (element) => {
        this.layout.current.handleSwitchPublished(this, element, Routing.generate(URL_SWITCH_PUBLISHED, {'id': element.id}), MSG_SWITCH_PUBLISHED);
    }

    handleContentList = (currentData, changeContext) => {
        return <FormationsList onChangeContext={changeContext}
                               onDelete={this.layout.current.handleDelete}
                               onDeleteAll={this.layout.current.handleDeleteGroup}
                               onSwitchPublished={this.handleSwitchPublished}
                               data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <FormationsFormulaire type="create" onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <FormationsFormulaire type="update" element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate} />
        </>
    }
}
