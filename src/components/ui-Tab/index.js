import React from 'react';

export default class Tab extends React.Component {
	constructor(props) {
		super(props);
		
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick() {
		this.props.onClick(this.props.id);
	}
	
	render() {
		var kind = "tab " + (this.props.active ? "active" : "inactive");
		return (
			<div className={kind} onClick={this.handleClick}>
			{this.props.label}
			</div>
		);
	}
}