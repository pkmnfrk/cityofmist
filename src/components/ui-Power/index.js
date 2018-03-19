import React from 'react';
import Icon from '../ui-Icon';
import './index.css';

import { editString } from '../../common';

export default class Power extends React.Component {
	constructor(props) {
		super(props);
		
		this.handleClick = this.handleClick.bind(this);
		this.handleBurn = this.handleBurn.bind(this);
	}
	
	handleClick() {
		if(this.props.isLocked) {
			if(!this.props.power.burned) {
				if(!this.props.power.selected) {
					this.props.power.selected = "plus";
				} else if(this.props.power.selected == "plus") {
				//	this.props.power.selected = "minus";
				//} else if(this.props.power.selected == "minus") {
					delete this.props.power.selected;
				}
			}
			this.props.onChange();
		} else {
			var newName = editString(this.props.power.name);
			if(newName != this.props.power.name) {
				this.props.power.name = newName;
				this.props.onChange();
			}
		}
	}
	
	
	handleBurn() {
		this.props.power.burned = !this.props.power.burned;
		if(this.props.power.burned) {
			delete this.props.power.selected;
		}
		this.props.onChange();
	}
	
	render() {
					
		return (
		<li className={this.props.power.selected}>
			<Icon icon="times-circle-o" hide={this.props.isLocked} onClick={this.props.onDelete} />
			<span className={(this.props.power.burned ? "burned" : "") + (this.props.isLocked ? "" : " editable")} onClick={this.handleClick}>
			{this.props.power.name}
			</span>
			<input type="checkbox" checked={this.props.power.burned} onChange={this.handleBurn} />
		</li>);
	}
/*m("li", 
{
	class: p.selected || null
},
[
	m("i[class=fa fa-times-circle-o close]", {onclick: () => this.deletePower(t, p)}),
	
	
	m("input[type=checkbox]", {checked: p.burned, onchange: (e) => {
		p.burned = e.target.checked;
		if(p.burned) {
			delete p.selected;
		}
		save();
	} })
])*/
}