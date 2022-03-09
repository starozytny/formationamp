function onPerPage(self, perPage, sorter = null){
    self.layout.current.handleUpdatePerPage(perPage, sorter);
    self.setState({ perPage: perPage });
}

function onSorter(self, nb, sortersFunction, perPage = null) {
    let sorter = sortersFunction[nb];
    if(perPage){
        self.layout.current.handleUpdatePerPage(perPage, sorter);
    }
    self.setState({ sorter: sorter });

    return sorter;
}

module.exports = {
    onPerPage,
    onSorter
}