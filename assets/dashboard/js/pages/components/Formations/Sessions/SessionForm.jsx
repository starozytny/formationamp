import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Select }       from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Trumb }               from "@dashboardComponents/Tools/Trumb";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";
import { DatePick, TimePick }  from "@dashboardComponents/Tools/DatePicker";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import HelpFunction            from "./helpFunction";

const URL_CREATE_ELEMENT     = "api_sessions_create";
const URL_UPDATE_GROUP       = "api_sessions_update";
const TXT_CREATE_BUTTON_FORM = "Ajouter la session";
const TXT_UPDATE_BUTTON_FORM = "Modifier la session";

let arrayZipcodes = [];

export function SessionsFormulaire ({ type, onChangeContext, onUpdateList, element, formationId })
{
    let title = "Ajouter une session";
    let url = Routing.generate(URL_CREATE_ELEMENT, {'formation': formationId});
    let msg = "Félicitation ! Vous avez ajouté une nouvelle session !"

    if(type === "update"){
        title = "Modifier " + element.id;
        url = Routing.generate(URL_UPDATE_GROUP, {'formation': formationId, 'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisé avec succès !";
    }

    let form = <Form
        context={type}
        url={url}
        animator={element ? Formulaire.setValueEmptyIfNull(element.animator) : ""}
        start={element ? (element.startJavascript ? new Date(element.startJavascript) : "") : ""}
        end={element ? (element.endJavascript ? new Date(element.endJavascript) : "") : ""}
        time={element ? Formulaire.setValueEmptyIfNull(element.time) : ""}
        time2={element ? Formulaire.setValueEmptyIfNull(element.time2) : ""}
        duration={element ? Formulaire.setValueEmptyIfNull(element.duration) : ""}
        duration2={element ? Formulaire.setValueEmptyIfNull(element.duration2) : ""}
        durationTotal={element ? Formulaire.setValueEmptyIfNull(element.durationTotal) : ""}
        durationByDay={element ? Formulaire.setValueEmptyIfNull(element.durationByDay) : ""}
        priceHt={element ? Formulaire.setValueEmptyIfNull(element.priceHT) : ""}
        priceTtc={element ? Formulaire.setValueEmptyIfNull(element.priceTTC) : ""}
        tva={element ? Formulaire.setValueEmptyIfNull(element.tva, 20) : 20}
        min={element ? Formulaire.setValueEmptyIfNull(element.min) : ""}
        max={element ? Formulaire.setValueEmptyIfNull(element.max) : ""}
        address={element ? Formulaire.setValueEmptyIfNull(element.address) : ""}
        zipcode={element ? Formulaire.setValueEmptyIfNull(element.zipcode) : ""}
        city={element ? Formulaire.setValueEmptyIfNull(element.city) : ""}
        type={element ? Formulaire.setValueEmptyIfNull(element.type, 0) : 0}
        modTrav={element ? Formulaire.setValueEmptyIfNull(element.modTrav) : ""}
        modEval={element ? Formulaire.setValueEmptyIfNull(element.modEval) : ""}
        modPeda={element ? Formulaire.setValueEmptyIfNull(element.modPeda) : ""}
        modAssi={element ? Formulaire.setValueEmptyIfNull(element.modAssi) : ""}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class Form extends Component {
    constructor(props) {
        super(props);

        let timeMorningStart = "";
        let timeMorningEnd = "";
        let timeAfterStart = "";
        let timeAfterEnd = "";

        if(props.time){
            let timeArray = HelpFunction.getTimeFromDatabase(props.time);
            timeMorningStart = timeArray[0];
            timeMorningEnd   = timeArray[1];
        }

        if(props.time2){
            let timeArray = HelpFunction.getTimeFromDatabase(props.time2);
            timeAfterStart = timeArray[0];
            timeAfterEnd   = timeArray[1];
        }

        this.state = {
            animator: props.animator,
            start: props.start,
            end: props.end,
            time: props.time,
            time2: props.time2,
            timeMorningStart: timeMorningStart ? timeMorningStart : "",
            timeMorningEnd: timeMorningEnd ? timeMorningEnd : "",
            timeAfterStart: timeAfterStart ? timeAfterStart : "",
            timeAfterEnd: timeAfterEnd ? timeAfterEnd : "",
            duration: props.duration,
            duration2: props.duration2,
            durationTotal: props.durationTotal,
            durationByDay: props.durationByDay,
            priceHt: props.priceHt,
            priceTtc: props.priceTtc,
            tva: props.tva,
            min: props.min,
            max: props.max,
            address: props.address,
            zipcode: props.zipcode,
            city: props.city,
            type: props.type,
            modTrav: { value: props.modTrav ? props.modTrav : "", html: props.modTrav ? props.modTrav : "" },
            modEval: { value: props.modEval ? props.modEval : "", html: props.modEval ? props.modEval : "" },
            modPeda: { value: props.modPeda ? props.modPeda : "", html: props.modPeda ? props.modPeda : "" },
            modAssi: { value: props.modAssi ? props.modAssi : "", html: props.modAssi ? props.modAssi : "" },
            errors: [],
            arrayPostalCode: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeZipcodeCity = this.handleChangeZipcodeCity.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeTrumb = this.handleChangeTrumb.bind(this);

        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeTimeMorning = this.handleChangeTimeMorning.bind(this);
        this.handleChangeTimeAfter = this.handleChangeTimeAfter.bind(this);
    }

    componentDidMount() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

        Helper.getPostalCodes(this);
    }

    handleChange = (e) => {
        const { priceHt, tva, priceTtc, address } = this.state;

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        let nPriceTtc = priceTtc;
        let nPriceHt = priceHt;
        let nAddress = address;

        if(name === "priceHt"){
            nPriceHt = value;
            nPriceTtc = tva !== "" ? ((parseFloat(value) * parseFloat(tva)) / 100) + parseFloat(value) : ""
        }

        if(name === "priceTtc"){
            nPriceTtc = value;
            nPriceHt = tva !== "" ? parseFloat(value) / (1 + (parseFloat(tva) / 100)) : "";
        }

        if(name === "type") {
            if(parseInt(value) === 1){
                nAddress = "En ligne";
            }else if(address === "En ligne" && parseInt(value) === 0){
                nAddress = "";
            }
        }

        if(name === "address"){
            nAddress = value;
        }

        this.setState({[name]: value, priceTtc: nPriceTtc, priceHt: nPriceHt, address: nAddress});
    }

    handleChangeZipcodeCity = (e) => {
        const { arrayPostalCode } = this.state;

        Helper.setCityFromZipcode(this, e, arrayPostalCode ? arrayPostalCode : arrayZipcodes)
    }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleChangeDate = (name, e) => {
        const { duration, duration2, start, end } = this.state;

        let nStart = name === "start" ? e : start;
        let nEnd   = name === "start" ? end : e;

        let durationTotal = HelpFunction.getDurationTotal(duration, duration2, nStart, nEnd);
        this.setState({ [name]: e !== null ? e : "", durationTotal: durationTotal })
    }

    handleChangeTimeMorning = (name, e) => {
        const { duration2, start, end } = this.state;

        let duration = HelpFunction.getIntervalTime(
            name === "timeMorningStart" ? this.state.timeMorningEnd : e,
            name === "timeMorningStart" ? e : this.state.timeMorningStart
        )

        let durationByDay = HelpFunction.getDurationByDay(duration, duration2);
        let durationTotal = HelpFunction.getDurationTotal(duration, duration2, start, end);

        this.setState({ [name]: e !== null ? e : "", duration: duration, durationByDay: durationByDay, durationTotal: durationTotal })
    }

    handleChangeTimeAfter = (name, e) => {
        const { duration, start, end } = this.state;

        let duration2 = HelpFunction.getIntervalTime(
            name === "timeAfterStart" ? this.state.timeAfterEnd : e,
            name === "timeAfterStart" ? e : this.state.timeAfterStart
        )

        let durationByDay = HelpFunction.getDurationByDay(duration, duration2);
        let durationTotal = HelpFunction.getDurationTotal(duration, duration2, start, end);

        this.setState({ [name]: e !== null ? e : "", duration2: duration2, durationByDay: durationByDay, durationTotal: durationTotal })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { animator, start, type, priceHt, priceTtc, tva, min, max, address,
            timeMorningStart, timeMorningEnd, timeAfterStart, timeAfterEnd,
        } = this.state;

        this.setState({ success: false })

        let method = context === "create" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text",   id: 'animator',  value: animator},
            {type: "text",   id: 'start',     value: start},
            {type: "text",   id: 'priceHt',   value: priceHt},
            {type: "text",   id: 'tva',       value: tva},
            {type: "text",   id: 'priceTtc',  value: priceTtc},
            {type: "text",   id: 'min',       value: min},
            {type: "text",   id: 'max',       value: max},
            {type: "minMax", id: 'min',       value: min, idCheck: 'max', valueCheck: max},
            {type: "text",   id: 'address',   value: address},
            {type: "text",   id: 'type',      value: type},
        ];

        if(timeMorningStart === "" && timeMorningEnd === "" && timeAfterStart === "" && timeAfterEnd === ""){
            paramsToValidate = [...paramsToValidate,
                ...[{type: "atLeastOne", id: 'timeMorningStart', value: timeMorningStart, idCheck: 'timeAfterStart', valueCheck: timeAfterStart}]
            ];
        }

        if(timeMorningStart !== "" || timeMorningEnd !== ""){
            paramsToValidate = [...paramsToValidate,
                ...[{type: "text", id: 'timeMorningStart', value: timeMorningStart}, {type: "text", id: 'timeMorningEnd', value: timeMorningEnd}]
            ];

            this.state.time = HelpFunction.setTimeToString(timeMorningStart, timeMorningEnd);
        }

        if(timeAfterStart !== "" || timeAfterEnd !== ""){
            paramsToValidate = [...paramsToValidate,
                ...[{type: "text", id: 'timeAfterStart', value: timeAfterStart}, {type: "text", id: 'timeAfterEnd', value: timeAfterEnd}]
            ];

            this.state.time2 = HelpFunction.setTimeToString(timeAfterStart, timeAfterEnd);
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate);
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;
            arrayZipcodes = this.state.arrayPostalCode;
            delete this.state.arrayPostalCode;
            axios({ method: method, url: url, data: this.state })
                .then(function (response) {
                    let data = response.data;
                    Helper.toTop();
                    if(self.props.onUpdateList){
                        self.props.onUpdateList(data);
                    }
                    self.setState({ success: messageSuccess, errors: [] });
                    if(context === "create"){
                        self.setState( {
                            start: "",
                            end: "",
                            timeMorningStart: "",
                            timeMorningEnd: "",
                            timeAfterStart: "",
                            timeAfterEnd: "",
                            duration: "",
                            duration2: "",
                            durationTotal: "",
                            durationByDay: "",
                            priceHt: "",
                            priceTtc: "",
                            tva: 20,
                            min: "",
                            max: "",
                            animator: "",
                            address: "",
                            zipcode: "",
                            city: "",
                            type: 0,
                            modTrav: { value: "", html: "" },
                            modEval: { value: "", html: "" },
                            modPeda: { value: "", html: "" },
                            modAssi: { value: "", html: "" },
                            arrayPostalCode: arrayZipcodes
                        })
                    }
                })
                .catch(function (error) {
                    Formulaire.displayErrors(self, error);
                })
                .then(() => {
                    Formulaire.loader(false);
                })
            ;
        }
    }

    render () {
        const { context } = this.props;
        const { errors, success, animator, start, end,
            timeMorningStart, timeMorningEnd, timeAfterStart, timeAfterEnd,
            duration, duration2, durationTotal, durationByDay,
            priceHt, priceTtc, tva, min, max,
            address, zipcode, city, type,
            modTrav, modEval, modPeda, modAssi } = this.state;

        let minHoursMorningStart = Helper.createTimeHoursMinutes(6, 0);
        let maxHoursMorningStart = timeMorningEnd ? timeMorningEnd : Helper.createTimeHoursMinutes(12, 0);

        let minHoursMorningEnd = timeMorningStart ? timeMorningStart : Helper.createTimeHoursMinutes(6, 0);
        let maxHoursMorningEnd = Helper.createTimeHoursMinutes(12, 0);

        let minHoursAfternoonStart = Helper.createTimeHoursMinutes(12, 0);
        let maxHoursAfternoonStart = timeAfterEnd ? timeAfterEnd : Helper.createTimeHoursMinutes(22, 0);

        let minHoursAfternoonEnd = timeAfterStart ? timeAfterStart : Helper.createTimeHoursMinutes(12, 0);
        let maxHoursAfternoonEnd = Helper.createTimeHoursMinutes(22, 0);

        let selectItems = [
            { value: 0, label: 'Présentiel', identifiant: 'présentiel' },
            { value: 1, label: 'Distance', identifiant: 'distance' },
        ]

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <div className="form-group">
                        <div className="form-group-title">Formation</div>
                    </div>
                </div>

                <div className="line line-2">
                    <Input identifiant="animator" valeur={animator} errors={errors} onChange={this.handleChange}>Animateur (s)</Input>
                    <Select items={selectItems} identifiant="type" valeur={type} errors={errors} onChange={this.handleChange} noEmpty={true}>Type de formation ?</Select>
                </div>

                <div className="line">
                    <div className="form-group">
                        <div className="form-group-title">Quand</div>
                    </div>
                </div>

                <div className="line line-2">
                    <DatePick identifiant="start" valeur={start} errors={errors} onChange={(e) => this.handleChangeDate('start', e)} minDate={new Date()} maxDate={end ? end : ""}>
                        Date de début
                    </DatePick>
                    <DatePick identifiant="end"   valeur={end} errors={errors}   onChange={(e) => this.handleChangeDate('end', e)} minDate={start ? start : new Date()}>
                        Date de fin
                    </DatePick>
                </div>

                <div className="line line-4">
                    <TimePick identifiant="timeMorningStart"  valeur={timeMorningStart}  errors={errors} onChange={(e) => this.handleChangeTimeMorning('timeMorningStart', e)}
                              timeIntervals={5} minTime={minHoursMorningStart} maxTime={maxHoursMorningStart}>
                        Horaire matin - début
                    </TimePick>
                    <TimePick identifiant="timeMorningEnd"  valeur={timeMorningEnd}  errors={errors} onChange={(e) => this.handleChangeTimeMorning('timeMorningEnd', e)}
                              timeIntervals={5} minTime={minHoursMorningEnd} maxTime={maxHoursMorningEnd}>
                        Horaire matin - fin
                    </TimePick>
                    <TimePick identifiant="timeAfterStart" valeur={timeAfterStart} errors={errors} onChange={(e) => this.handleChangeTimeAfter('timeAfterStart', e)}
                              timeIntervals={5} minTime={minHoursAfternoonStart} maxTime={maxHoursAfternoonStart}>
                        Horaire après-midi - début
                    </TimePick>
                    <TimePick identifiant="timeAfterEnd" valeur={timeAfterEnd} errors={errors} onChange={(e) => this.handleChangeTimeAfter('timeAfterEnd', e)}
                              timeIntervals={5} minTime={minHoursAfternoonEnd} maxTime={maxHoursAfternoonEnd}>
                        Horaire après-midi - fin
                    </TimePick>
                </div>

                <div className="line line-4">
                    <div className="form-group">Durée matin : {duration ? duration : "/"}</div>
                    <div className="form-group" />
                    <div className="form-group">Durée après-midi : {duration2 ? duration2 : "/"}</div>
                    <div className="form-group" />
                </div>
                <div className="line line-2">
                    <div className="form-group">Durée par jour  : {durationByDay ? durationByDay : "/"}</div>
                    <div className="form-group">Durée totale : {durationTotal ? durationTotal : "/"}</div>
                </div>

                <div className="line">
                    <div className="form-group">
                        <div className="form-group-title">Nombre de places</div>
                    </div>
                </div>

                <div className="line line-2">
                    <Input identifiant="min" valeur={min} errors={errors} onChange={this.handleChange} type="number">Place min</Input>
                    <Input identifiant="max" valeur={max} errors={errors} onChange={this.handleChange} type="number">Place max</Input>
                </div>

                <div className="line">
                    <div className="form-group">
                        <div className="form-group-title">Financier</div>
                    </div>
                </div>

                <div className="line line-3">
                    <Input identifiant="priceHt"  valeur={priceHt} errors={errors} onChange={this.handleChange}  type="number" step={"any"}>Prix HT (€)</Input>
                    <Input identifiant="tva"      valeur={tva} errors={errors} onChange={this.handleChange}      type="number" step={"any"}>TVA (%)</Input>
                    <Input identifiant="priceTtc" valeur={priceTtc} errors={errors} onChange={this.handleChange} type="number" step={"any"}>Prix TTC (€)</Input>
                </div>

                <div className="line">
                    <div className="form-group">
                        <div className="form-group-title">Localisation</div>
                    </div>
                </div>

                <div className="line line-3">
                    <Input identifiant="address" valeur={address} errors={errors} onChange={this.handleChange} placeholder="'En ligne' - si formation à distance">Adresse</Input>
                    <Input identifiant="zipcode" valeur={zipcode} errors={errors} onChange={this.handleChangeZipcodeCity} type="number">Code postal</Input>
                    <Input identifiant="city" valeur={city} errors={errors} onChange={this.handleChange}>Ville</Input>
                </div>

                <div className="line">
                    <div className="form-group">
                        <div className="form-group-title">Contenu</div>
                    </div>
                </div>

                <div className="line line-2">
                    <Trumb identifiant="modTrav" valeur={modTrav.value} errors={errors} onChange={this.handleChangeTrumb}>ModTrav</Trumb>
                    <Trumb identifiant="modEval" valeur={modEval.value} errors={errors} onChange={this.handleChangeTrumb}>modEval</Trumb>
                </div>

                <div className="line line-2">
                    <Trumb identifiant="modPeda" valeur={modPeda.value} errors={errors} onChange={this.handleChangeTrumb}>modPeda</Trumb>
                    <Trumb identifiant="modAssi" valeur={modAssi.value} errors={errors} onChange={this.handleChangeTrumb}>modAssi</Trumb>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}