import React, { Component } from 'react';

import parse from "html-react-parser";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

export class BlogItem extends Component {
    render () {
        const { elem } = this.props

        return <div className="card">
            <div className="card-header">
                <div className="title">{elem.title}</div>
                <div className="sub">Publié le {elem.createAtString}</div>
            </div>
            <div className="card-body">
                <div>{parse(elem.introduction)}</div>
            </div>
            <div className="card-footer">
                <a href="">En savoir plus</a>
            </div>
        </div>
    }
}