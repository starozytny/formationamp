import React, { Component } from 'react';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon } from "@dashboardComponents/Tools/Button";
import { InfosSession } from "@dashboardPages/components/Formations/Sessions/SessionsItem";

export class MySessionsItem extends Component {
    render () {
        const { elem } = this.props;

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <InfosSession elem={elem} />
                        <div className="col-4 actions">
                            <ButtonIcon element="a" icon="download" target="_blank"
                                        onClick={Routing.generate('api_sessions_conventions', {'slug': elem.slug})}
                            >
                                Conventions
                            </ButtonIcon>
                            <ButtonIcon element="a" icon="download" target="_blank"
                                        onClick={Routing.generate('api_sessions_attestations', {'slug': elem.slug})}
                            >
                                Attestations
                            </ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}