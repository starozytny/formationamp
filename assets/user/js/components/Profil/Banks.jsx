import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { BanksList }      from "./BanksList";

const URL_DELETE_ELEMENT    = 'api_contact_delete';
const MSG_DELETE_ELEMENT    = 'Supprimer ce message ?';
const URL_IS_SEEN           = 'api_contact_isSeen';
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