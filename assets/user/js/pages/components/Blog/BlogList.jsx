import React, { Component } from 'react';

import { Alert }        from "@dashboardComponents/Tools/Alert";

import { BlogItem } from "./BlogItem";

export class BlogList extends Component {

    render () {
        const { data } = this.props;

        return <>
            <div className="list-articles">
                {data && data.length !== 0 ? data.map(elem => {
                    return <BlogItem {...this.props} elem={elem} key={elem.id}/>
                }) : <Alert>Aucun résultat</Alert>}
            </div>
        </>
    }
}