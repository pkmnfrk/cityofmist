import React from 'react';

export default class TabPage extends React.Component {
	constructor(props) {
		super(props);
		
	}
	
	render() {
		return <React.Fragment>{this.props.children()}</React.Fragment>;
	}
}