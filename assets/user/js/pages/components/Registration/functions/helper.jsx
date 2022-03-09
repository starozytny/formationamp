function getWorkers(workers)
{
    let workersRegulars = [], workersSpecials = [];
    workers.forEach(worker => {
        if(worker.type !== 2) {
            workersRegulars.push(worker)
        }else{
            workersSpecials.push(worker)
        }
    })

    return [workersRegulars, workersSpecials]
}

module.exports = {
    getWorkers
}
