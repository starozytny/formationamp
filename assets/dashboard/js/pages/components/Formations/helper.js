function getCategories(){
    return [
        { value: 0, label: "Syndic",                    identifiant: "f-syndic" },
        { value: 1, label: "Gestion",                   identifiant: "f-gestion" },
        { value: 2, label: "Transaction",               identifiant: "f-transac" },
        { value: 3, label: "Immobilier d'entreprise",   identifiant: "f-immo" },
        { value: 4, label: "Dirigeants",                identifiant: "f-dirigeant" },
        { value: 5, label: "Management",                identifiant: "f-management" },
        { value: 6, label: "International",             identifiant: "f-internat" },
        { value: 7, label: "Working lunch",             identifiant: "f-working" },
    ]
}

function getCategoriesString(categories){
    let strings = [];

    if(categories){
        let cats = getCategories();

        categories.forEach(cat => {
            cats.forEach(c => {
                if(c.value === cat){
                    strings.push(c);
                }
            })
        })
    }

    return strings;
}

module.exports = {
    getCategories,
    getCategoriesString
}