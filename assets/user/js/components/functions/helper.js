const toastr = require('toastr');

function addOrRemove(data, el, txtAdd="", txtRemove="", isUpdate=false, txtUpdate=""){
    let find = false;
    let newData = [];
    data.forEach(item => {
        if((item.id && item.id === el.id) || (item.uid && item.uid === el.uid)){
            find = true;
        }else{
            newData.push(item);
        }
    })

    if(!find){
        newData = data;
        newData.push(el);
        toastr.info(txtAdd);
    }else{
        if(isUpdate){
            newData.push(el);
            toastr.info(txtUpdate);
        }else{
            toastr.info(txtRemove);
        }
    }

    return newData;
}

module.exports = {
    addOrRemove
}