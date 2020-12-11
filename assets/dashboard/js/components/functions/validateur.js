function validateText($value) {
    if($value === ""){
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

function validatePassword($value, $valueCheck){
    if($value === ""){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }

    return {'code': true};

    // if (/^(?=.{12,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\w).*$/.test($value)){
    //
    //     if($value !== $valueCheck){
    //         return {
    //             'code': false,
    //             'isCheckError': true,
    //             'message': 'Les mots de passes ne sont pas identique.'
    //         };
    //     }
    //
    //     return {'code': true};
    // }else{
    //     return {
    //         'code': false,
    //         'message': 'Le mot de passe doit contenir 1 majuscule, 1 minuscule, 1 chiffre, 1 caratère spécial et au moins 12 caractères.'
    //     };
    // }
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

function validateur(values){
    let validate; let code = true;
    let errors = {};
    values.forEach(element => {
        switch (element.type) {
            case 'text':
                validate = validateText(element.value);
                break;
            case 'email':
                validate = validateEmail(element.value);
                break;
            case 'array':
                validate = validateArray(element.value);
                break;
            case 'password':
                validate = validatePassword(element.value, element.valueCheck);
                break;
        }
        if(!validate.code){
            if(validate.isCheckError){
                errors[element.idCheck] = {
                    value: element.valueCheck,
                    error: validate.message
                };
            }else{
                errors[element.id] = {
                    value: element.value,
                    error: validate.message
                };
            }

            code = false;
        }
    });

    return {
        'code': code,
        'errors': errors
    };
}

module.exports = {
    validateur
}