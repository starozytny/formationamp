import React, { Component } from 'react';

import axios        from "axios";
import Swal         from "sweetalert2";
import toastr       from "toastr";
import SwalOptions  from "@commonComponents/functions/swalOptions";
import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";
import Helper            from "@commonComponents/functions/helper";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { OrdersList }      from "./OrdersList";

const URL_DELETE_ELEMENT    = 'api_orders_delete';
const URL_DELETE_GROUP      = 'api_orders_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer cet ordre ?';
const MSG_DELETE_GROUP      = 'Aucun ordre sélectionné.';
const SORTER = Sort.compareCreatedAtInverse;

function filterFunction(dataImmuable, filters){
    let newData = [];
    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            filters.forEach(filter => {
                if(filter === el.status){
                    newData.filter(elem => elem.id !== el.id)
                    newData.push(el);
                }
            })
        })
    }

    return newData;
}

export class Orders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            pathDeleteGroup: URL_DELETE_GROUP,
            msgDeleteGroup: MSG_DELETE_GROUP,
            sessionName: "orders.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleProcess = this.handleProcess.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, filterFunction); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "orders", true, filterFunction); }

    handleCancel = (element) => {
        let self = this;
        Swal.fire(SwalOptions.options("Annuler cet ordre ?", "Action irréversible"))
            .then((result) => {
                if (result.isConfirmed) {
                    Formulaire.loader(true);
                    axios.post(Routing.generate('api_orders_cancel', {'id': element.id}), {})
                        .then(function (response) {
                            self.handleUpdateList(response.data, "update");
                            toastr.info("Order annulé.")
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

    handleRefresh = (element) => {
        let self = this;
        Formulaire.loader(true);
        axios.post(Routing.generate('api_orders_refresh', {'id': element.id}), {})
            .then(function (response) {
                self.handleUpdateList(response.data, "update");
                toastr.info("Code rafraîchi.")
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
            })
            .then(() => {
                Formulaire.loader(false);
            })
        ;
    }

    handleProcess = (id, name="") => { // id or "all"
        let self = this;
        let title = id === "all" ? "Traiter tous les ordres validés ?" : "Traiter cet ordre ?"
        let text = id === "all" ? "Action irréversible" : "Ordre : " + name + "<br><br> Action irréversible";
        Swal.fire(SwalOptions.options(title, text))
            .then((result) => {
                if (result.isConfirmed) {
                    Formulaire.loader(true);
                    axios.post(Routing.generate('api_orders_process'), {'id': id})
                        .then(function (response) {
                            let filename = (new Date().getTime()).toString();
                            filename = "paiement-" + filename.substr(0, filename.length - 3) + ".xml";
                            Helper.downloadBinaryFile(response.data, filename, true);
                            location.reload();
                        })
                        .catch(function (error) {
                            Formulaire.loader(false);
                            Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
                        })
                    ;
                }
            })
        ;
    }

    handleContentList = (currentData, changeContext, getFilters, filters) => {
        return <OrdersList onChangeContext={changeContext}
                           onDelete={this.layout.current.handleDelete}
                           onDeleteAll={this.layout.current.handleDeleteGroup}
                           onSearch={this.handleSearch}
                           filters={filters}
                           onGetFilters={this.handleGetFilters}
                           isDeveloper={this.props.isDeveloper === "true"}
                           onCancel={this.handleCancel}
                           onRefresh={this.handleRefresh}
                           onProcess={this.handleProcess}
                           data={currentData} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}
