import React from 'react';

import Tab from '../ui-Tab';
import { draw } from '../../common';

export default class TabSwitcher extends React.Component {
	constructor(props) {
		super(props);
		
		/*this.state = {
			active: this.props.activeTab
		};*/
		
		this.handleTabClick = this.handleTabClick.bind(this);
	}
	
	handleTabClick(tab) {
		this.props.onSwitch(tab);
	}
	
	render() {
		
		if(!TabSwitcher.active) {
			TabSwitcher.active = this.props.activeTab
		}
		if(!TabSwitcher.active) {
			TabSwitcher.active = this.props.tabs[0].id;
		}
		
		var tabList = this.props.tabs.map((t, i) =>
			<Tab
				label={t.label}
				id={t.id}
				key={t.id}
				active={t.id == this.props.activeTab}
				onClick={this.handleTabClick}
			/>
		);
		
		return (
			<div className="tabswitcher">
			{tabList}
			</div>
		);
		
		/*return m(".tabswitcher", tabs.map(function(t, i) {
			var update = function() {
				var dom = document.getElementById(t.id);
				if(t.id != TabSwitcher.active && dom) {
					dom.style.display = "none";
				} else if(dom) {
					dom.style.display = null;
					TabSwitcher.title = t.label;
				}
			};
			return m(".tab", {
				"class": t.id == TabSwitcher.active ? "active" : "inactive",
				onclick: function() {
					TabSwitcher.active = t.id;
					if(onswitch) onswitch(t.id, t.label);
					draw();
				},
				onupdate: update,
				oncreate: update
			}, t.label);
			
		}));*/
	}
};
