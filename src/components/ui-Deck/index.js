import React from 'react';

import Name from '../ui-Name';
import TabSwitcher from '../ui-TabSwitcher';
import TabCatcher from '../ui-TabCatcher';
import SubContent from '../ui-SubContent';
import ThemeList from '../ui-ThemeList';
import Roller from '../ui-Roller';
//import Statuses from './Statuses';
//import Moves from './Moves';
//import MapScreen from './MapScreen';
import { firstName, toggleLocked } from '../../common';

var tabs = [
	{
		id: "main",
		label: "Character"
	},
	{
		id: "map",
		label: "Map"
	},
	{
		id: "moves",
		label: "Moves"
	},
];

export default class Deck extends React.Component {
	constructor(props) {
		super(props);
		
		this.handleNameChange = this.handleNameChange.bind(this);
	}
	
	handleNameChange(newName) {
		this.props.char.name = newName;
		
		this.props.onChange();
	}
	
	mainContent() {
		return (
		<div id="main">
			<Name name={this.props.char.name} onChange={this.handleNameChange} isLocked={this.props.isLocked} />
			<ThemeList themes={this.props.char.themes} isLocked={this.props.isLocked} />
			<button className="unlock" onClick={toggleLocked}>Lock/unlock themes</button>
		</div>
		);
	}
	
	mapContent() {
		//<MapScreen />
		return (
			<div>TBD</div>
		);
	}
	
	moveContent() {
		//<Moves personal={this.props.char.moves} />
		return (
			<div>TBD</div>
		);
	}
	
	render() {
		var content = {
			main: this.mainContent,
			map: this.mapContent,
			moves: this.moveContent
		};
		
		var thing = content[this.props.activeTab].bind(this);
		
		return (
			<div>
				<TabSwitcher tabs={tabs} activeTab={this.props.activeTab} onSwitch={this.props.onSwitch} />
				{thing()}
			</div>
		);
	}
};

/*
export default {
	view: function(vnode) {
		return [
			m(TabSwitcher, {
				tabs: tabs,
				activetab: vnode.attrs.activetab,
				onswitch: vnode.attrs.onswitch
			}),
			m("#main", [
				m(Name, {char: vnode.attrs.char}),
				m(Theme, {themes: vnode.attrs.char.themes}),
				m(Roller, { who: firstName(vnode.attrs.char.name), room: vnode.attrs.room, char: vnode.attrs.char }),
				m(Statuses, {statuses: vnode.attrs.char.statuses}),
				m("button[class=unlock]", { onclick: () => {toggleLocked()}}, "Lock/unlock themes")
			]),
			m(Moves, {
				personal: vnode.attrs.char.moves
			}),
			m(MapScreen)
        ];
	}
};*/