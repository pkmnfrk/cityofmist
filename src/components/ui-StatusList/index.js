import React from 'react';
import Status from '../ui-Status';

export default class StatusList extends React.Component {
	constructor(props) {
		super(props);
		
		
	}
    deleteStatus(status) {
		var ix = this.props.statuses.indexOf(status);
		if(ix !== -1) {
			this.props.statuses.splice(ix, 1);
			this.props.onChange();
		}
    }
    
    addStatus() {
        var newStatus = {
            spectrum: 1
        };
        
        this.props.statuses.push(newStatus);
        
        this.props.onChange();
    }
	
	render() {
		return (
		<React.Fragment>
		{this.props.statuses.map((status, ix) => 
			<Status
				key={ix}
				onChange={this.props.onChange}
				onDelete={() => this.deleteStatus(status)}
				status={status}
			/>
		)}
			<button className="newstatus" onClick={() => this.addStatus()}>Add status</button>
		</React.Fragment>
		);
		
	}
};