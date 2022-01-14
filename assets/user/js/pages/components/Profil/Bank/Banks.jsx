import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { BanksList }      from "./BanksList";

const URL_DELETE_ELEMENT    = 'api_banks_delete';
const MSG_DELETE_ELEMENT    = 'Supprimer ce RIB ?';
const URL_SWITCH_PUBLISHED  = 'api_banks_main';
const MSG_SWITCH_PUBLISHED  = 'Banque';
const SORTER = Sort.compareCreatedAt;

export class Banks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            sessionName: "profil.bank.pagination",
            classes: ""
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSwitchMain = this.handleSwitchMain.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSwitchMain = (element) => {
        this.layout.current.handleSwitchData(this, element.isMain, Routing.generate(URL_SWITCH_PUBLISHED, {'id': element.id}), MSG_SWITCH_PUBLISHED, " secondaire", " principale");
        location.reload();
    }

    handleContentList = (currentData, changeContext) => {
        return <BanksList onChangeContext={changeContext}
                          onDelete={this.layout.current.handleDelete}
                          onSwitchMain={this.handleSwitchMain}
                          data={currentData} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}