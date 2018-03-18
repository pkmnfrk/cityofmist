import React from 'react';

class TabCatcher extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			hasError: false
		};
	}
	
	componentDidCatch(error, info) {
		this.setState({ hasError: true });
		//console.error(error);
	}
	
	render() {
		if(this.state.hasError) {
			return <h1>Tab missing</h1>;
		}
		
		return this.props.children;
	}
}