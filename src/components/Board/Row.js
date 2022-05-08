import React from 'react';



class Row extends React.Component {

    renderTableRows = () => {
        const appts = this.props.appts;
        if (!appts) return null; 
        const scheduleRows = appts.map(appt => {
            return (
                <tr key={appt.index}>
                    <td>{appt.name}</td>
                    <td></td>
                    <td>NEED</td>
                    <td></td>
                    <td>{appt.time}</td>
                    <td>{appt.description}</td>
                </tr>
            );
        });
        return scheduleRows;

    }

    render() {
        return this.renderTableRows();
    }
}


export default Row;