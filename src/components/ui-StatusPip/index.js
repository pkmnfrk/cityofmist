import React from 'react';

export default class Status extends React.Component {
	
	render() {
		return (<div className={"col " + (this.props.shaded ? "shaded" : "")} onClick={this.props.onClick}>
			<div className="label">{this.props.label}</div>
			<div/>
			<div className="number">{this.props.number}</div>
		</div>);
	}
}