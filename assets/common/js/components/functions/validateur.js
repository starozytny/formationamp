const {func} = require("prop-types");

function validateDate($value) {
    if($value === "" || $value === null){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }
    return {'code': true};
}

function validateText($value) {
    if($value === "" || $value === null){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }
    return {'code': true};
}

function validateEmail($value){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($value)){
        return {'code': true};
    }
    return {
        'code': false,
        'message': 'Cette adresse e-mail est invalide.'
    };
}

function validateEmailConfirm($value, $valueCheck){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($value)){

        if($value !== $valueCheck){
            return {
                'code': false,
                'isCheckError': true,
                'message': 'Les adresses e-mail ne sont pas identique.'
            };
        }

        return {'code': true};
    }
    return {
        'code': false,
        'message': 'Cette adresse e-mail est invalide.'
    };
}

function validatePassword($value, $valueCheck){
    if($value === ""){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }

    return {'code': true};

    if (/^(?=.{12,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\w).*$/.test($value)){

        if($value !== $valueCheck){
            return {
                'code': false,
                'isCheckError': true,
                'message': 'Les mots de passes ne sont pas identique.'
            };
        }

        return {'code': true};
    }else{
        return {
            'code': false,
            'message': 'Le mot de passe doit contenir 1 majuscule, 1 minuscule, 1 chiffre, 1 caratère spécial et au moins 12 caractères.'
        };
    }
}

function validateArray($value){
    if($value.length <= 0){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }
    return {'code': true};
}

function validateAtLeastOne($value, $valueCheck) {
    if($value === "" && $valueCheck === ""){
        return {
            'code': false,
            'message': 'Au moins un champ doit être renseigné.'
        };
    }
    return {'code': true};
}

function validateMinMax($value, $valueCheck) {
    if(parseFloat($value) > parseFloat($valueCheck)){
        return {
            'code': false,
            'message': 'La valeur MIN doit être inférieur à la valeur MAX.'
        };
    }
    return {'code': true};
}

function validateIban($value) {
    if($value === "" || $value === null){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }

    $value = $value.trim();
    $value = $value.replaceAll(" ", "");

    let find = false;
    FORMAT_IBAN.forEach(format => {
        if (format.test($value)) {
            find = true;
        }
    })

    if (find) {
        return {'code': true};
    }else{
        return {
            'code': false,
            'message': 'Veuillez saisir un IBAN valide'
        };
    }
}

function switchCase(element){
    let validate;
    switch (element.type) {
        case 'text':
            validate = validateText(element.value);
            break;
        case 'email':
            validate = validateEmail(element.value);
            break;
        case 'emailConfirm':
            validate = validateEmailConfirm(element.value, element.valueCheck);
            break;
        case 'array':
            validate = validateArray(element.value);
            break;
        case 'password':
            validate = validatePassword(element.value, element.valueCheck);
            break;
        case 'atLeastOne':
            validate = validateAtLeastOne(element.value, element.valueCheck);
            break;
        case 'date':
            validate = validateDate(element.value);
            break;
        case 'minMax':
            validate = validateMinMax(element.value, element.valueCheck);
            break;
        case 'iban':
            validate = validateIban(element.value);
            break;
    }

    return validate;
}

function validateur(values, valuesIfExistes){
    let validate; let code = true;
    let errors = [];
    values.forEach(element => {
        validate = switchCase(element);
        if(!validate.code){
            code = false;
            errors.push({
                name: validate.isCheckError ? element.idCheck : element.id,
                message: validate.message
            })
        }
    });

    if(valuesIfExistes){
        valuesIfExistes.forEach(element => {
            if(element.value !== "" || element.value !== null){
                validate = switchCase(element);
                if(!validate.code){
                    code = false;
                    errors.push({
                        name: validate.isCheckError ? element.idCheck : element.id,
                        message: validate.message
                    })
                }
            }
        });
    }

    return {
        code: code,
        errors: errors
    };
}

const FORMAT_IBAN = [
    /^AD\d{2}\d{4}\d{4}[\dA-Z]{12}$/, // Andorra
    /^AE\d{2}\d{3}\d{16}$/, // United Arab Emirates
    /^AL\d{2}\d{8}[\dA-Z]{16}$/, // Albania
    /^AO\d{2}\d{21}$/, // Angola
    /^AT\d{2}\d{5}\d{11}$/, // Austria
    /^FI\d{2}\d{6}\d{7}\d{1}$/, // Aland Islands
    /^AZ\d{2}[A-Z]{4}[\dA-Z]{20}$/, // Azerbaijan
    /^BA\d{2}\d{3}\d{3}\d{8}\d{2}$/, // Bosnia and Herzegovina
    /^BE\d{2}\d{3}\d{7}\d{2}$/, // Belgium
    /^BF\d{2}\d{23}$/, // Burkina Faso
    /^BG\d{2}[A-Z]{4}\d{4}\d{2}[\dA-Z]{8}$/, // Bulgaria
    /^BH\d{2}[A-Z]{4}[\dA-Z]{14}$/, // Bahrain
    /^BI\d{2}\d{12}$/, // Burundi
    /^BJ\d{2}[A-Z]{1}\d{23}$/, // Benin
    /^BY\d{2}[\dA-Z]{4}\d{4}[\dA-Z]{16}$/, // Belarus - https://bank.codes/iban/structure/belarus/
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // Saint Barthelemy
    /^BR\d{2}\d{8}\d{5}\d{10}[A-Z][\dA-Z]$/, // Brazil
    /^CG\d{2}\d{23}$/, // Congo
    /^CH\d{2}\d{5}[\dA-Z]{12}$/, // Switzerland
    /^CI\d{2}[A-Z]{1}\d{23}$/, // Ivory Coast
    /^CM\d{2}\d{23}$/, // Cameron
    /^CR\d{2}0\d{3}\d{14}$/, // Costa Rica
    /^CV\d{2}\d{21}$/, // Cape Verde
    /^CY\d{2}\d{3}\d{5}[\dA-Z]{16}$/, // Cyprus
    /^CZ\d{2}\d{20}$/, // Czech Republic
    /^DE\d{2}\d{8}\d{10}$/, // Germany
    /^DO\d{2}[\dA-Z]{4}\d{20}$/, // Dominican Republic
    /^DK\d{2}\d{4}\d{10}$/, // Denmark
    /^DZ\d{2}\d{20}$/, // Algeria
    /^EE\d{2}\d{2}\d{2}\d{11}\d{1}$/, // Estonia
    /^ES\d{2}\d{4}\d{4}\d{1}\d{1}\d{10}$/, // Spain (also includes Canary Islands, Ceuta and Melilla)
    /^FI\d{2}\d{6}\d{7}\d{1}$/, // Finland
    /^FO\d{2}\d{4}\d{9}\d{1}$/, // Faroe Islands
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // France
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // French Guyana
    /^GB\d{2}[A-Z]{4}\d{6}\d{8}$/, // United Kingdom of Great Britain and Northern Ireland
    /^GE\d{2}[A-Z]{2}\d{16}$/, // Georgia
    /^GI\d{2}[A-Z]{4}[\dA-Z]{15}$/, // Gibraltar
    /^GL\d{2}\d{4}\d{9}\d{1}$/, // Greenland
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // Guadeloupe
    /^GR\d{2}\d{3}\d{4}[\dA-Z]{16}$/, // Greece
    /^GT\d{2}[\dA-Z]{4}[\dA-Z]{20}$/, // Guatemala
    /^HR\d{2}\d{7}\d{10}$/, // Croatia
    /^HU\d{2}\d{3}\d{4}\d{1}\d{15}\d{1}$/, // Hungary
    /^IE\d{2}[A-Z]{4}\d{6}\d{8}$/, // Ireland
    /^IL\d{2}\d{3}\d{3}\d{13}$/, // Israel
    /^IR\d{2}\d{22}$/, // Iran
    /^IS\d{2}\d{4}\d{2}\d{6}\d{10}$/, // Iceland
    /^IT\d{2}[A-Z]{1}\d{5}\d{5}[\dA-Z]{12}$/, // Italy
    /^JO\d{2}[A-Z]{4}\d{4}[\dA-Z]{18}$/, // Jordan
    /^KW\d{2}[A-Z]{4}\d{22}$/, // KUWAIT
    /^KZ\d{2}\d{3}[\dA-Z]{13}$/, // Kazakhstan
    /^LB\d{2}\d{4}[\dA-Z]{20}$/, // LEBANON
    /^LI\d{2}\d{5}[\dA-Z]{12}$/, // Liechtenstein (Principality of)
    /^LT\d{2}\d{5}\d{11}$/, // Lithuania
    /^LU\d{2}\d{3}[\dA-Z]{13}$/, // Luxembourg
    /^LV\d{2}[A-Z]{4}[\dA-Z]{13}$/, // Latvia
    /^MC\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // Monaco
    /^MD\d{2}[\dA-Z]{2}[\dA-Z]{18}$/, // Moldova
    /^ME\d{2}\d{3}\d{13}\d{2}$/, // Montenegro
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // Saint Martin (French part)
    /^MG\d{2}\d{23}$/, // Madagascar
    /^MK\d{2}\d{3}[\dA-Z]{10}\d{2}$/, // Macedonia, Former Yugoslav Republic of
    /^ML\d{2}[A-Z]{1}\d{23}$/, // Mali
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // Martinique
    /^MR13\d{5}\d{5}\d{11}\d{2}$/, // Mauritania
    /^MT\d{2}[A-Z]{4}\d{5}[\dA-Z]{18}$/, // Malta
    /^MU\d{2}[A-Z]{4}\d{2}\d{2}\d{12}\d{3}[A-Z]{3}$/, // Mauritius
    /^MZ\d{2}\d{21}$/, // Mozambique
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // New Caledonia
    /^NL\d{2}[A-Z]{4}\d{10}$/, // The Netherlands
    /^NO\d{2}\d{4}\d{6}\d{1}$/, // Norway
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // French Polynesia
    /^PK\d{2}[A-Z]{4}[\dA-Z]{16}$/, // Pakistan
    /^PL\d{2}\d{8}\d{16}$/, // Poland
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // Saint Pierre et Miquelon
    /^PS\d{2}[A-Z]{4}[\dA-Z]{21}$/, // Palestine, State of
    /^PT\d{2}\d{4}\d{4}\d{11}\d{2}$/, // Portugal (plus Azores and Madeira)
    /^QA\d{2}[A-Z]{4}[\dA-Z]{21}$/, // Qatar
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // Reunion
    /^RO\d{2}[A-Z]{4}[\dA-Z]{16}$/, // Romania
    /^RS\d{2}\d{3}\d{13}\d{2}$/, // Serbia
    /^SA\d{2}\d{2}[\dA-Z]{18}$/, // Saudi Arabia
    /^SE\d{2}\d{3}\d{16}\d{1}$/, // Sweden
    /^SI\d{2}\d{5}\d{8}\d{2}$/, // Slovenia
    /^SK\d{2}\d{4}\d{6}\d{10}$/, // Slovak Republic
    /^SM\d{2}[A-Z]{1}\d{5}\d{5}[\dA-Z]{12}$/, // San Marino
    /^SN\d{2}[A-Z]{1}\d{23}$/, // Senegal
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // French Southern Territories
    /^TL\d{2}\d{3}\d{14}\d{2}$/, // Timor-Leste
    /^TN59\d{2}\d{3}\d{13}\d{2}$/, // Tunisia
    /^TR\d{2}\d{5}[\dA-Z]{1}[\dA-Z]{16}$/, // Turkey
    /^UA\d{2}\d{6}[\dA-Z]{19}$/, // Ukraine
    /^VA\d{2}\d{3}\d{15}$/, // Vatican City State
    /^VG\d{2}[A-Z]{4}\d{16}$/, // Virgin Islands, British
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // Wallis and Futuna Islands
    /^XK\d{2}\d{4}\d{10}\d{2}$/, // Republic of Kosovo
    /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/, // Mayotte
]

module.exports = {
    validateur
}