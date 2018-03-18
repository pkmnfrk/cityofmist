import React from 'react';
 
import { editString } from '../../common';

export default class Name extends React.Component {
	constructor(props) {
		super(props);
		
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick(e) {
		if(!this.props.isLocked) {
			var newName = editString(this.props.name);
			
			this.props.onChange(newName);
		}
	}
	
    render() {
		return (
			<div className="name" onClick={this.handleClick}>
				{this.props.name}
			</div>
		);
    }
};