import React, { Component } from 'react';

import Routing        from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Alert }      from "@dashboardComponents/Tools/Alert";
import { Button }     from "@dashboardComponents/Tools/Button";
import { Search }     from "@dashboardComponents/Layout/Search";
import { Filter, FilterSelected } from "@dashboardComponents/Layout/Filter";

import { TeamItem }   from "./TeamItem";

export class TeamList extends Component {
    constructor(props) {
        super(props);

        this.filter = React.createRef();

        this.handleFilter = this.handleFilter.bind(this);
    }

    handleFilter = (e) => {
        this.filter.current.handleChange(e, true);
    }

    render () {
        const { data, onSearch, filters, onGetFilters } = this.props;

        let filtersLabel = ["Salarié", "Non salarié", "Agent commercial", "Responsable"];
        let filtersId    = ["f-salarie", "f-no-salarie", "f-agent-co", "f-resp"];

        let itemsFilter = [
            { value: 0, id: filtersId[0], label: filtersLabel[0] },
            { value: 1, id: filtersId[1], label: filtersLabel[1] },
            { value: 2, id: filtersId[2], label: filtersLabel[2] },
            { value: 3, id: filtersId[3], label: filtersLabel[3] }
        ];

        return <>
            <div className="toolbar">
                <div className="item create">
                    <Button element="a" onClick={Routing.generate('user_team_create')}>Ajouter un membre</Button>
                </div>
                <div className="item filter-search">
                    <Filter ref={this.filter} items={itemsFilter} onGetFilters={onGetFilters} />
                    <Search onSearch={onSearch} placeholder="Recherche par nom ou prénom.."/>
                    <FilterSelected filters={filters} itemsFiltersLabel={filtersLabel} itemsFiltersId={filtersId} onChange={this.handleFilter}/>
                </div>
            </div>
            <div>
                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-3">
                                        <div className="col-1">Equipe</div>
                                        <div className="col-2">Type</div>
                                        <div className="col-3 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <TeamItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}