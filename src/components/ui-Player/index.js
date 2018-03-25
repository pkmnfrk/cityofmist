import React from 'react';

import Deck from '../ui-Deck';
import Theme from '../ui-Theme';
import * as Common from '../../common';
import './index.css';
import { template } from '../ui-Theme';


export default class Player extends React.Component {
	constructor(props) {
		super(props);
		
		this.savedVersions = [];
		
		this.state = {
			player: null,
			currentTab: (location.hash || "#main").substring(1),
			isLocked: true
		};
		
		Object.getOwnPropertyNames(Player.prototype).forEach((prop) => {
			if(typeof(this[prop]) == "function" && prop.startsWith("handle")) {
				//console.log(prop);
				this[prop] = this[prop].bind(this);
			}
		})
	}
	
	componentDidMount() {
		Common.getSave(this.props.room, this.props.player, (err, data) => {
			if(err) {
				data = {
					name: "<character name>",
					themes: [
						template(),
						template(),
						template(),
						template()
					],
					statuses: []
				};
				data.themes[0].type = "mythos";
			}
			
			this.setState({
				player: data
			});
		});
		
		document.addEventListener('keypress', this.handleKeyPress);
		
		this.characterClient = Common.client.subscribe('/character/' + this.props.room, (message) => {
			if(message.id != this.props.player) return;
			
			if(message.version) {
				var ix = this.savedVersions.indexOf(message.version);
				if(ix !== -1) {
					this.savedVersions.splice(ix, 1);
				} else {
					this.setState({
						player: message
					});
				}
			}
			
		});
		
		window.addEventListener('popstate', this.handlePopState);
	}
	
	componentWillUnmount() {
		window.removeEventListener('popstate', this.handlePopState);
		
		this.characterClient.unsubscribe();
		
	}
	
	handleState(state) {
		if(!state) state = {tab: "main"};
		
		this.setState({
			currentTab: state.tab
		});
	}
	
	handlePopState(e) {
		this.handleState(e.state);
	}
	
	handleOnSwitchTab(tab, title) {
		history.pushState({tab: tab}, title + " - City of Mist", "#" + tab);
		
		this.setState({
			currentTab: tab
		});
	}
	
	handleSave() {
		if(this.state.player != null) {
			var ver = Math.floor(Math.random() * 10000000);
			this.state.player.version = ver;
			this.savedVersions.push(ver);
			
			Common.putSave(this.props.room, this.props.player, this.state.player);
			/*console.log("Skipped saving");*/
			
			this.setState({
				player: this.state.player
			})
		}
	}
	
	handleKeyPress(e) {
		e = e || window.event;
    
		if(e.key == "l") {
			this.handleToggleLocked();
		}		
	}
	
	handleToggleLocked() {
		this.setState({
			isLocked: !this.state.isLocked
		})
	}
	
	render() {
		if(this.state.player != null) {
			return (
				<Deck 
					char={this.state.player} 
					activeTab={this.state.currentTab}
					onSwitch={this.handleOnSwitchTab}
					room={this.props.room}
					onChange={this.handleSave}
					isLocked={this.state.isLocked}
					toggleLocked={this.handleToggleLocked}
					/>
			);
		}
		
		return <div>Loading...</div>;
	}
}