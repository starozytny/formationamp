function search(type, dataImmuable, search) {
    let newData = [];
    search = search.toLowerCase();
    newData = dataImmuable.filter(function(v) {
        return switchFunction(type, search, v);
    })

    return newData;
}

function switchFunction(type, search, v) {
    switch (type) {
        case "user":
            if(v.username.toLowerCase().startsWith(search)
                || v.email.toLowerCase().startsWith(search)
                || v.firstname.toLowerCase().startsWith(search)
                || v.lastname.toLowerCase().startsWith(search)
            ){
                return v;
            }
            break;
        case "society":
        case "changelog":
            if(v.name.toLowerCase().startsWith(search)){
                return v;
            }
            break;
        case "invoice":
            if(v.numero.toString().toLowerCase().includes(search)
                || v.toName.toLowerCase().startsWith(search)){
                return v;
            }
            break;
        case "orders":
            if(v.name.toLowerCase().startsWith(search)
                || v.titulaire.toLowerCase().startsWith(search)
                || v.price === parseFloat(search)
                || v.email.toLowerCase().startsWith(search)
            ){
                return v;
            }
            break;
        case "team":
            if(v.firstname.toLowerCase().startsWith(search)
                || v.lastname.toLowerCase().startsWith(search)
            ){
                return v;
            }
            break;
        case "article":
            if(v.title.toLowerCase().startsWith(search)){
                return v;
            }
            break;
        default:
            break;
    }
}

module.exports = {
    search
}
