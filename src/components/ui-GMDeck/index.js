import React from 'react'

import Name from '../ui-Name';
import TabSwitcher from '../ui-TabSwitcher';
import Theme from '../ui-Theme';
import Roller from '../ui-Roller';
import Statuses from '../ui-StatusList';
import Moves from '../ui-MoveList';
import MapScreen from '../ui-MapScreen';
import Icon from '../ui-Icon';

//import { firstName, toggleLocked } from './common';

var tabs = [
	{
		id: "main",
		label: "Characters"
	},
	{
		id: "map",
		label: "Map"
	},
	{
		id: "moves",
		label: "Moves"
	}
];

export default class GMDeck extends React.Component {
	constructor(props) {
		super(props);
		
		Object.getOwnPropertyNames(GMDeck.prototype).forEach((prop) => {
			if(typeof(this[prop]) == "function" && prop.startsWith("handle")) {
				//console.log(prop);
				this[prop] = this[prop].bind(this);
			}
		})
		
	}
	
	
    spectrum(s) {
        if(s <= 1) return "1";
        if(s <= 2) return "2";
        if(s <= 3) return "2 + " + (s - 2);
        if(s <= 4) return "3";
        if(s <= 6) return "3 + " + (s - 4);
        if(s <= 7) return "4";
        if(s <= 10) return "4 + " + (s - 7);
        if(s <= 11) return "5";
        if(s <= 15) return "5 + " + (s - 11);
        if(s <= 16) return "6";
    }
	
	renderTheme(theme, key) {
		return (
			<li key={key} className={theme.type}>
				{theme.name}
				<span className="attention">
					<Icon outline="true" icon={(theme.attention >= 1 ? "check-" : "") + "square"} />
					<Icon outline="true" icon={(theme.attention >= 2 ? "check-" : "") + "square"} />
					<Icon outline="true" icon={(theme.attention >= 3 ? "check-" : "") + "square"} />
				</span>
				<span className="fade">
					<Icon outline="true" icon={(theme.fade >= 1 ? "times-" : "") + "circle"} />
					<Icon outline="true" icon={(theme.fade >= 2 ? "times-" : "") + "circle"} />
					<Icon outline="true" icon={(theme.fade >= 3 ? "times-" : "") + "circle"} />
				</span>
				<ul className="powers">
				{theme.powertags.map((p, ix) =>
					<li key={ix} className={(p.burned ? "burned " : "") + p.selected}>{p.name}</li>
				)}
				</ul>
				<ul className="weaknesses">
				{theme.weaknesses.map((p, ix) =>
					<li key={ix} className={p.selected}>{p.name}</li>
				)}
				</ul>
				
			</li>
		);
	}
	
	renderStatus(status, key) {
		return (
			<li key={key} className={(status.spectrum >= 11 ? "danger ": "") + (status.selected || "")}>
				{status.name} - {this.spectrum(status.spectrum)}
			</li>
		);
	}
	
	renderChar(charKey) {
		var char = this.props.chars[charKey];
		if(!char) return null;
		
		return (
			<div key={charKey} className="player">
				<div className="human">Player: <a href={"/?" + this.props.room + "/" + charKey}>{charKey}</a></div>
				<div className="name">Name: {char.name}</div>
				<div>
					Themes:
					<ul className="themes">
						{char.themes.map((t, ix) => this.renderTheme(t, ix))}
					</ul>
				</div>
				<div>
					Statuses:
					<ul className="statuses">
						{char.statuses.map((s, ix) => this.renderStatus(s, ix))}
					</ul>
				</div>
			</div>
		);
	}
	
	renderMain() {
		var mainStyle = {
			gridTemplateColumns: "repeat(" + (this.props.charKeys.length + 1) + ", 1fr)"
		};
		
		if(this.props.activeTab != "main") {
			mainStyle.display = "none";
		}
		
		return (
			<div id="main" style={mainStyle}>
				<Roller who="GM" room={this.props.room} onChange={this.props.onChange} />
				{this.props.charKeys.map((charKey) => this.renderChar(charKey))}
			</div>
		);
	}
	
	renderMap() {
		return <MapScreen room={this.props.room} hide={this.props.activeTab != "map"} isGm="true"/>;
	}
	
	renderMoves() {
		var moves = this.props.charKeys.map((c) => {
			var char = this.props.chars[c];
			if(!char) return [];
			var ret = this.props.chars[c].moves.map((d) => {
				return {
					name: this.props.chars[c].name + ' - ' + d.name,
					moves: d.moves
				};
			})
			return ret;
		}).reduce((a,b) => a.concat(b), []);
		
		return <Moves personal={moves} hide={this.props.activeTab != "moves"}/>;
	}
	
	
	render() {
		var content = () => null;
		
		switch(this.props.activeTab) {
			case "main": content = this.renderMain; break;
			case "map": content = this.renderMap; break;
			case "moves": content = this.renderMoves; break;
		}
		
		return (<React.Fragment>
			<TabSwitcher tabs={tabs} activeTab={this.props.activeTab} onSwitch={this.props.onSwitch} />
			{this.renderMain()}
			{this.renderMap()}
			{this.renderMoves()}
		</React.Fragment>);
	}
	
    view(vnode) {
        var allchars = vnode.attrs.chars;
        var allcharkeys = Object.keys(allchars);
		
        return [

			m(MapScreen)
        ];
    }
};