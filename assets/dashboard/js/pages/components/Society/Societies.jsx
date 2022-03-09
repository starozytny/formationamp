import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { SocietiesList }       from "@dashboardPages/components/Society/SocietiesList";
import { SocietyFormulaire }   from "@dashboardPages/components/Society/SocietyForm";
import { SocietyRead }         from "@dashboardPages/components/Society/SocietyRead";

const URL_DELETE_ELEMENT    = 'api_societies_delete';
const URL_DELETE_GROUP      = 'api_societies_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer cette société ?';
const MSG_DELETE_GROUP      = 'Aucune société sélectionnée.';
let SORTER = Sort.compareName;

export class Societies extends Component {
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
            sessionName: "societies.pagination",
            users: props.users ? JSON.parse(props.users) : []
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
        this.handleContentRead = this.handleContentRead.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "society"); }

    handleContentList = (currentData, changeContext) => {
        return <SocietiesList onChangeContext={changeContext}
                              onDelete={this.layout.current.handleDelete}
                              onDeleteAll={this.layout.current.handleDeleteGroup}
                              developer={parseInt(this.props.developer)}
                              onSearch={this.handleSearch}
                              users={this.state.users}
                              data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <SocietyFormulaire type="create" onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <SocietyFormulaire type="update" element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentRead = (changeContext, element) => {
        return <SocietyRead elem={element} onChangeContext={changeContext} users={this.state.users} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList} onContentRead={this.handleContentRead}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}