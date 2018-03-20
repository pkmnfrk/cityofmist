import React from 'react';

import Name from '../ui-Name';
import TabSwitcher from '../ui-TabSwitcher';
import TabCatcher from '../ui-TabCatcher';
import SubContent from '../ui-SubContent';
import ThemeList from '../ui-ThemeList';
import Roller from '../ui-Roller';
import StatusList from '../ui-StatusList';
//import Moves from './Moves';
//import MapScreen from './MapScreen';
import { firstName } from '../../common';

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
			<ThemeList themes={this.props.char.themes} isLocked={this.props.isLocked} onChange={this.props.onChange} />
			<Roller who={firstName(this.props.char.name)} room={this.props.room} char={this.props.char} onChange={this.props.onChange} />
			<StatusList onChange={this.props.onChange} statuses={this.props.char.statuses} />
			<button className="unlock" onClick={this.props.toggleLocked}>Lock/unlock themes</button>
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
			<React.Fragment>
				<TabSwitcher tabs={tabs} activeTab={this.props.activeTab} onSwitch={this.props.onSwitch} />
				{thing()}
			</React.Fragment>
		);
	}
};

/*
export default {
	view: function(vnode) {
		return [
			m("#main", [
				m(Statuses, {statuses: vnode.attrs.char.statuses}),
				
			]),
			m(Moves, {
				personal: vnode.attrs.char.moves
			}),
			m(MapScreen)
        ];
	}
};*/