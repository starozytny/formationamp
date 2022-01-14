import React, { Component } from 'react';

import axios        from "axios";
import Swal         from "sweetalert2";
import toastr       from "toastr";
import SwalOptions  from "@commonComponents/functions/swalOptions";
import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { OrdersList }    from "@userPages/components/Profil/Order/OrdersList";

const SORTER = Sort.compareCreatedAtInverse;

export class Orders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            sessionName: "profil.orders.pagination",
            classes: ""
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleCancel = (element) => {
        let self = this;
        Swal.fire(SwalOptions.options("Annuler ce paiement ?", "Action irréversible"))
            .then((result) => {
                if (result.isConfirmed) {
                    Formulaire.loader(true);
                    axios.post(Routing.generate('api_orders_cancel', {'id': element.id}), {})
                        .then(function (response) {
                            self.handleUpdateList(response.data, "update");
                            toastr.info("Paiement annulé.")
                        })
                        .catch(function (error) {
                            Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
                        })
                        .then(() => {
                            Formulaire.loader(false);
                        })
                    ;
                }
            })
        ;
    }

    handleContentList = (currentData, changeContext) => {
        return <OrdersList onChangeContext={changeContext}
                           onCancel={this.handleCancel}
                           data={currentData} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}