import React from 'react';
import Tag from '../ui-Tag';
import * as Common from '../../common';

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
            spectrum: 1,
			type: "tag",
			id: Common.randomId()
        };
        
        this.props.statuses.push(newStatus);
        
        this.props.onChange();
    }
	
	render() {
		return (
		<React.Fragment>
		{this.props.statuses.map((status, ix) => 
			<Tag
				key={status.id}
				onChange={this.props.onChange}
				onDelete={() => this.deleteStatus(status)}
				tag={status}
			/>
		)}
			<button className="newstatus" onClick={() => this.addStatus()}>Add Tracking Card</button>
		</React.Fragment>
		);
		
	}
};