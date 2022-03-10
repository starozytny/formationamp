import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { LotsList }      from "./LotsList";

const URL_DELETE_ELEMENT    = 'api_orders_delete';
const URL_DELETE_GROUP      = 'api_orders_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer ce lot ?';
const MSG_DELETE_GROUP      = 'Aucun lot sélectionné.';
const SORTER = Sort.compareCreatedAtInverse;

export class Lots extends Component {
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
            sessionName: "lots.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleContentList = (currentData, changeContext) => {
        return <LotsList onChangeContext={changeContext}
                         onDelete={this.layout.current.handleDelete}
                         onDeleteAll={this.layout.current.handleDeleteGroup}
                         isDeveloper={this.props.isDeveloper === "true"}
                         data={currentData} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}
