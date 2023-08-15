import React from 'react'
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

export default class Table extends React.Component{
    constructor(){
        super()
        console.log("const table");
    }

    render(){
        return(
            <div>
                <BootstrapTable
                    striped
                    keyField="id"
                    data={this.props.data}
                    columns={this.props.columns}
                    pagination={paginationFactory({ sizePerPage: 10 })}
                    noDataIndication={this.props.indication}
                />
            </div>
        )
    }
}
