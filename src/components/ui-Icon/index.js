import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default class Icon extends React.Component {
	constructor(props) {
		super(props);
	}
	
	stopErrantClicks(e) {
		e.preventDefault();
	}
	
	render() {
		if(this.props.hide)
			return null;
		
		var prefix = "fa";
		var style = {};
		var size = null;
		var onMouseDown = null;
		
		if(this.props.outline || this.props.icon.endsWith("-o")) {
			prefix = "far";
		}
		
		if(this.props.big) {
			size = "2x";
		}
		
		var icon = this.props.icon;
		
		if(icon.endsWith("-o")) {
			icon = icon.substring(0, icon.length - 2);
		}
		
		if(this.props.onClick) {
			onMouseDown = this.stopErrantClicks;
		}
		
		return (
			//<i className={klas} onClick={this.props.onClick} style={style} />
			<FontAwesomeIcon className={this.props.className} icon={[prefix, icon]} size={size} fixedWidth={this.props.fixedWidth} onClick={this.props.onClick} onMouseDown={onMouseDown} />
		);
	}
}