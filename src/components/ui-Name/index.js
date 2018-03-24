import React from 'react';
 
import { editString } from '../../common';
import "./index.css"; 

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
			<div className={"name" + (this.props.isLocked ? "" : " editable")} onClick={this.handleClick}>
				{this.props.name}
			</div>
		);
    }
};