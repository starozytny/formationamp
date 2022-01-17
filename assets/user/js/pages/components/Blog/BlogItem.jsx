import React, { Component } from 'react';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

export class BlogItem extends Component {
    render () {
        const { elem } = this.props

        return <div className="item">
            {elem.title}
        </div>
    }
}