import React, { Component } from 'react';

import axios             from "axios";
import toastr            from "toastr";
import Swal              from "sweetalert2";
import SwalOptions       from "@commonComponents/functions/swalOptions";
import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";
import Filter            from "@commonComponents/functions/filter";
import TopToolbar        from "@commonComponents/functions/topToolbar";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { UserList }       from "./UserList";
import { UserRead }       from "./UserRead";
import { UserFormulaire } from "./UserForm";

const URL_DELETE_ELEMENT    = 'api_users_delete';
const URL_DELETE_GROUP      = 'api_users_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer cet utilisateur ?';
const MSG_DELETE_GROUP      = 'Aucun utilisateur sélectionné.';
let SORTER = Sort.compareLastname;

let sorters = [
    { value: 0, label: 'Nom',           identifiant: 'sorter-nom' },
    { value: 1, label: 'Identifiant',   identifiant: 'sorter-identifiant' },
    { value: 2, label: 'Email',         identifiant: 'sorter-email' },
]

let sortersFunction = [Sort.compareLastname, Sort.compareUsername, Sort.compareEmail];

export class User extends Component {
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
            sessionName: "user.pagination",
            isClient: props.isClient ? props.isClient : false,
            societies: props.societies ? JSON.parse(props.societies) : []
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);
        this.handleRegenPassword = this.handleRegenPassword.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
        this.handleContentRead = this.handleContentRead.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees, "read", "username"); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, Filter.filterHighRoleCode); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "user", true, Filter.filterHighRoleCode); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleRegenPassword = (elem) => {
        const self = this;
        Swal.fire(SwalOptions.options("Réinitialiser son mot de passe", "Le nouveau mot de passe ne s'affichera <u>qu'une seule fois</u>. Pensez donc à le noter."))
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(Routing.generate('api_users_password_reinit', {'token': elem.token}), {})
                        .then(function (response) {
                            Swal.fire(response.data.message, '', 'success');
                            toastr.info("Mot de passe réinitialisé avec succès !");
                        })
                        .catch(function (error) {
                            Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
                        })
                    ;
                }
            })
        ;
    }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { perPage, currentPage } = this.state;

        return <UserList onChangeContext={changeContext}
                         onDelete={this.layout.current.handleDelete}
                         onDeleteAll={this.layout.current.handleDeleteGroup}
                         developer={parseInt(this.props.developer)}
                         //filter-search
                         onSearch={this.handleSearch}
                         filters={filters}
                         onGetFilters={this.handleGetFilters}
                         //changeNumberPerPage
                         perPage={perPage}
                         onPerPage={this.handlePerPage}
                         //twice pagination
                         currentPage={currentPage}
                         onPaginationClick={this.layout.current.handleGetPaginationClick(this)}
                         taille={data.length}
                         //sorter
                         sorters={sorters}
                         onSorter={this.handleSorter}
                         //data
                         isClient={this.state.isClient}
                         onRegenPassword={this.handleRegenPassword}
                         data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { societies } = this.state;
        return <UserFormulaire type="create" societies={societies} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        const { societies } = this.state;
        return <UserFormulaire type="update" societies={societies} element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentRead = (changeContext, element) => {
        return <UserRead elem={element} onChangeContext={changeContext} onRegenPassword={this.handleRegenPassword}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} search={this.props.search} onGetData={this.handleGetData}
                    onContentList={this.handleContentList} onContentRead={this.handleContentRead}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}
                    onChangeCurrentPage={this.handleChangeCurrentPage}/>
        </>
    }
}