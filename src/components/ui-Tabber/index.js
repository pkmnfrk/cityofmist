import React from 'react';
import TabPage from '../ui-TabPage';

export default class Tabber extends React.Component {
	constructor(props) {
		super(props);
		
	}
	
	render() {
		var content = null;
		
		for(var child of this.props.children) {
			if(child.type != TabPage) {
				throw new Error("Child " + child.type + " is wrong type");
			}
			
			if(child.props.id == this.props.activeTab) {
				content = child;
			}
		}
		
		return <React.Fragment>
		{content}
		</React.Fragment>;
	}
}