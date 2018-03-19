import React from 'react';

export default class CheckScale extends React.Component {
	constructor(props) {
		super(props);
		
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(v) {
		if(this.props.value >= v) {
			v = v - 1;
		}
		this.props.onChange(v);
	}
	
	render() {
		var num = this.props.maxValue || 3;
		
		var els = [];
		
		for(var i = 1; i <= num; i++) {
			els.push(((j)=> <input key={j} type="checkbox" checked={i <= this.props.value} onChange={() => this.handleChange(j)} />)(i));
		}
		
		return (
			<div className="mark">
				{els}
			</div>
		);
	}
}