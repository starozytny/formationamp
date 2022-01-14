import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { MySessionsList }       from "./MySessionsList";

const SORTER = Sort.compareStartInverse;

export class MySessions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            sessionName: "user.my.sessions.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleContentList = (currentData) => {
        return <MySessionsList data={currentData} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}
