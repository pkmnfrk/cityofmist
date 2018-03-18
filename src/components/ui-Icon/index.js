import React from 'react';

export default class Icon extends React.PureComponent {
	render() {
		var klas = "fa";
		var style = {};
		
		if(this.props.big) {
			klas += " fa-2x";
		}
		
		if(this.props.fixed) {
			klas += " fa-fw";
		}
		
		klas += " fa-" + this.props.icon;
		
		if(this.props.className) {
			klas += " " + this.props.className;
		}
		
		if(this.props.hide) {
			style.display = 'none';
		}
		
		return (
			<i className={klas} onClick={this.props.onClick} style={style} />
		);
	}
}