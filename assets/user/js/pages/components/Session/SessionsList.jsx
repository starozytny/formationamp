import React, { Component } from 'react';

import { Alert }              from "@dashboardComponents/Tools/Alert";

import { SessionsItem }     from "./SessionsItem";

export class SessionsList extends Component {
    render () {
        const { data } = this.props;

        return <>
            <div>
                <div className="items-table">
                    <div className="items items-default">
                        {data && data.length !== 0 ? data.map(elem => {
                            return <SessionsItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}