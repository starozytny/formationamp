import React, { Component } from 'react';

import { Alert }              from "@dashboardComponents/Tools/Alert";

import { MySessionsItem }     from "./MySessionsItem";
import { HeaderSession }      from "@dashboardPages/components/Formations/Sessions/SessionsItem";

export class MySessionsList extends Component {
    render () {
        const { data } = this.props;

        return <>
            <div>
                <div className="items-table">
                    <div className="items items-default">
                        <HeaderSession />
                        {data && data.length !== 0 ? data.map(elem => {
                            return <MySessionsItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}