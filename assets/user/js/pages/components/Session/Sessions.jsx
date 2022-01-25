import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { SessionsList }       from "./SessionsList";

const SORTER = Sort.compareStart;

export class Sessions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            sessionName: "user.sessions.pagination",
            registrations: props.registrations ? JSON.parse(props.registrations) : [],
            isFromApp: props.isFromApp ? props.isFromApp : false
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleContentList = (currentData) => {
        return <SessionsList data={currentData} registrations={this.state.registrations} isFromApp={this.state.isFromApp} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}
