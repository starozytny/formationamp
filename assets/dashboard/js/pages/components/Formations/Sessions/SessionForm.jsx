import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
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

const URL_CREATE_ELEMENT     = "api_formations_create";
const URL_UPDATE_GROUP       = "api_formations_update";
const TXT_CREATE_BUTTON_FORM = "Ajouter la session";
const TXT_UPDATE_BUTTON_FORM = "Modifier la session";

export function SessionsFormulaire ({ type, onChangeContext, onUpdateList, element })
{
    let title = "Ajouter une session";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitation ! Vous avez ajouté une nouvelle session !"

    if(type === "update"){
        title = "Modifier " + element.id;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisé avec succès !";
    }

    let form = <Form
        context={type}
        url={url}
        start={element ? new Date(element.starJavascriptt) : ""}
        end={element ? new Date(element.endJavascript) : ""}
        time={element ? element.time : ""}
        time2={element ? element.time2 : ""}
        priceHt={element ? element.priceHt : ""}
        priceTtc={element ? element.priceTtc : ""}
        tva={element ? element.tva : 20}
        duration={element ? new Date(element.durationJavascript) : ""}
        duration2={element ? new Date(element.duration2Javascript) : ""}
        durationTotal={element ? new Date(element.durationTotalJavascript) : ""}
        durationByDay={element ? new Date(element.durationByDayJavascript) : ""}
        min={element ? element.min : ""}
        max={element ? element.max : ""}
        animator={element ? element.animator : ""}
        address={element ? element.address : ""}
        zipcode={element ? element.zipcode : ""}
        city={element ? element.city : ""}
        type={element ? element.type : 0}
        modTrav={element ? element.modTrav : ""}
        modEval={element ? element.modEval : ""}
        modPeda={element ? element.modPeda : ""}
        modAssi={element ? element.modAssi : ""}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            start: props.start,
            end: props.end,
            timeMorningStart: props.time,
            timeMorningEnd: props.time,
            timeAfterStart: props.time2,
            timeAfterEnd: props.time2,
            priceHt: props.priceHt,
            priceTtc: props.priceTtc,
            tva: props.tva,
            duration: props.duration,
            duration2: props.duration2,
            durationTotal: props.durationTotal,
            durationByDay: props.durationByDay,
            min: props.min,
            max: props.max,
            animator: props.animator,
            address: props.address,
            zipcode: props.zipcode,
            city: props.city,
            type: props.type,
            modTrav: { value: props.modTrav ? props.modTrav : "", html: props.modTrav ? props.modTrav : "" },
            modEval: { value: props.modEval ? props.modEval : "", html: props.modEval ? props.modEval : "" },
            modPeda: { value: props.modPeda ? props.modPeda : "", html: props.modPeda ? props.modPeda : "" },
            modAssi: { value: props.modAssi ? props.modAssi : "", html: props.modAssi ? props.modAssi : "" },
            errors: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeTrumb = this.handleChangeTrumb.bind(this);

        this.handleChangeDateStart = this.handleChangeDateStart.bind(this);
        this.handleChangeDateEnd = this.handleChangeDateEnd.bind(this);
        this.handleChangeTimeMorningStart = this.handleChangeTimeMorningStart.bind(this);
        this.handleChangeTimeMorningEnd = this.handleChangeTimeMorningEnd.bind(this);
        this.handleChangeTimeAfterStart = this.handleChangeTimeAfterStart.bind(this);
        this.handleChangeTimeAfterEnd = this.handleChangeTimeAfterEnd.bind(this);
    }

    componentDidMount() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    handleChangeDateStart = (e) => { this.setState({ start: e !== null ? e : "" }) }
    handleChangeDateEnd = (e) => { this.setState({ end: e !== null ? e : "" }) }
    handleChangeTimeMorningStart = (e) => { this.setState({ timeMorningStart: e !== null ? e : "" }) }
    handleChangeTimeMorningEnd = (e) => { this.setState({ timeMorningEnd: e !== null ? e : "" }) }
    handleChangeTimeAfterStart = (e) => { this.setState({ timeAfterStart: e !== null ? e : "" }) }
    handleChangeTimeAfterEnd = (e) => { this.setState({ timeAfterEnd: e !== null ? e : "" }) }

    handleChange = (e) => {
        const { priceHt, tva, priceTtc } = this.state;
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        let nPriceTtc = priceTtc;
        let nPriceHt = priceHt;
        if(name === "priceHt"){
            nPriceHt = value;
            if(tva !== ""){
                nPriceTtc =  ( (parseFloat(value) * parseFloat(tva)) / 100 ) + parseFloat(value);
            }else{
                nPriceTtc = "";
            }
        }

        if(name === "priceTtc"){
            nPriceTtc = value;
            if(tva !== ""){
                nPriceHt = parseFloat(value) / (1 + (parseFloat(tva) / 100));
            }else{
                nPriceHt = "";
            }
        }

        this.setState({[name]: value, priceTtc: nPriceTtc, priceHt: nPriceHt});
    }

    handleChangeTrumb = (e) => {
        const { modTrav, modEval, modPeda, modAssi } = this.state

        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;
        let el;
        switch (name) {
            case "modAssi":
                el = modAssi;
                break;
            case "modPeda":
                el = modPeda;
                break;
            case "modEval":
                el = modEval;
                break;
            default:
                el = modTrav;
                break;
        }

        this.setState({[name]: {value: el.value, html: text}})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { start,
            timeMorningStart, timeMorningEnd, timeAfterStart, timeAfterEnd,
            priceHt, priceTtc, tva
        } = this.state;

        this.setState({ success: false })

        let paramsToValidate = [
            {type: "text", id: 'start',  value: start},
            {type: "text", id: 'priceHt',  value: priceHt},
            {type: "text", id: 'tva',  value: tva},
            {type: "text", id: 'priceTtc',  value: priceTtc},
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
        }

        if(timeAfterStart !== "" || timeAfterEnd !== ""){
            paramsToValidate = [...paramsToValidate,
                ...[{type: "text", id: 'timeAfterStart', value: timeAfterStart}, {type: "text", id: 'timeAfterEnd', value: timeAfterEnd}]
            ];
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            toastr.warning("Veuillez vérifier les informations transmises.");
            this.setState({ errors: validate.errors });
        }else{
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    let data = response.data;
                    self.props.onUpdateList(data);
                    self.setState({ success: messageSuccess, errors: [] });
                    if(context === "create"){
                        self.setState( {
                            name: '',
                            content: { value: "", html: "" },
                            price: '',
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
        const { errors, success, start, end,
            timeMorningStart, timeMorningEnd, timeAfterStart, timeAfterEnd,
            priceHt, priceTtc, tva,
            modTrav, modEval, modPeda, modAssi } = this.state;

        let minHoursMorningStart = Helper.createTimeHoursMinutes(6, 0);
        let maxHoursMorningStart = timeMorningEnd ? timeMorningEnd : Helper.createTimeHoursMinutes(12, 0);

        let minHoursMorningEnd = timeMorningStart ? timeMorningStart : Helper.createTimeHoursMinutes(6, 0);
        let maxHoursMorningEnd = Helper.createTimeHoursMinutes(12, 0);

        let minHoursAfternoonStart = Helper.createTimeHoursMinutes(12, 0);
        let maxHoursAfternoonStart = timeAfterEnd ? timeAfterEnd : Helper.createTimeHoursMinutes(22, 0);

        let minHoursAfternoonEnd = timeAfterStart ? timeAfterStart : Helper.createTimeHoursMinutes(12, 0);
        let maxHoursAfternoonEnd = Helper.createTimeHoursMinutes(22, 0);

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <div className="form-group">
                        <div className="form-group-title">Quand ?</div>
                    </div>
                </div>

                <div className="line line-2">
                    <DatePick identifiant="start" valeur={start} errors={errors} onChange={this.handleChangeDateStart} minDate={new Date()} maxDate={end ? end : ""}>
                        Date de début
                    </DatePick>
                    <DatePick identifiant="end"   valeur={end} errors={errors}   onChange={this.handleChangeDateEnd} minDate={start ? start : new Date()}>
                        Date de fin
                    </DatePick>
                </div>

                <div className="line line-4">
                    <TimePick identifiant="timeMorningStart"  valeur={timeMorningStart}  errors={errors} onChange={this.handleChangeTimeMorningStart}
                              timeIntervals={5} minTime={minHoursMorningStart} maxTime={maxHoursMorningStart}>
                        Horaire matin - début
                    </TimePick>
                    <TimePick identifiant="timeMorningEnd"  valeur={timeMorningEnd}  errors={errors} onChange={this.handleChangeTimeMorningEnd}
                              timeIntervals={5} minTime={minHoursMorningEnd} maxTime={maxHoursMorningEnd}>
                        Horaire matin - fin
                    </TimePick>
                    <TimePick identifiant="timeAfterStart" valeur={timeAfterStart} errors={errors} onChange={this.handleChangeTimeAfterStart}
                              timeIntervals={5} minTime={minHoursAfternoonStart} maxTime={maxHoursAfternoonStart}>
                        Horaire après midi - début
                    </TimePick>
                    <TimePick identifiant="timeAfterEnd" valeur={timeAfterEnd} errors={errors} onChange={this.handleChangeTimeAfterEnd}
                              timeIntervals={5} minTime={minHoursAfternoonEnd} maxTime={maxHoursAfternoonEnd}>
                        Horaire après midi - fin
                    </TimePick>
                </div>

                <div className="line">
                    <div className="form-group">
                        <div className="form-group-title">Financier</div>
                    </div>
                </div>

                <div className="line line-3">
                    <Input identifiant="priceHt" valeur={priceHt} errors={errors} onChange={this.handleChange} type="number" step={"any"}>Prix HT (€)</Input>
                    <Input identifiant="tva" valeur={tva} errors={errors} onChange={this.handleChange} type="number" step={"any"}>TVA (%)</Input>
                    <Input identifiant="priceTtc" valeur={priceTtc} errors={errors} onChange={this.handleChange} type="number" step={"any"}>Prix TTC (€)</Input>
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