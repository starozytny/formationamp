import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { TeamList }      from "./TeamList";

const URL_DELETE_ELEMENT    = 'api_team_delete';
const MSG_DELETE_ELEMENT    = 'Supprimer ce membre ?';
const URL_SWITCH_PUBLISHED  = 'api_team_archived';
const MSG_SWITCH_PUBLISHED  = 'Membre';
const SORTER = Sort.compareLastname;

function filterFunction(dataImmuable, filters){
    let newData = [];
    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            filters.forEach(filter => {
                if(filter === el.type){
                    newData.filter(elem => elem.id !== el.id)
                    newData.push(el);
                }
            })
        })
    }

    return newData;
}

export class Team extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            sessionName: "user.team.pagination",
            classes: ""
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSwitchArchived = this.handleSwitchArchived.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, filterFunction); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "team", true, filterFunction); }

    handleSwitchArchived = (element) => {
        this.layout.current.handleSwitchData(this, element.isArchived, Routing.generate(URL_SWITCH_PUBLISHED, {'id': element.id}), MSG_SWITCH_PUBLISHED);
    }

    handleContentList = (currentData, changeContext, getFilters, filters) => {
        return <TeamList onChangeContext={changeContext}
                         onDelete={this.layout.current.handleDelete}
                         onSwitchArchived={this.handleSwitchArchived}
                         onSearch={this.handleSearch}
                         filters={filters}
                         onGetFilters={this.handleGetFilters}
                         dataArchived={JSON.parse(this.props.dataArchived)}
                         data={currentData} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}