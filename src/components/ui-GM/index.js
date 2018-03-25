import React from 'react'
import GMDeck from '../ui-GMDeck';

import * as Common from "../../common";

export default class GM extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			charKeys: [],
			chars: {},
			activeTab: this.props.activeTab,
		}
		
		this.loadindex = 0;
		
		Object.getOwnPropertyNames(GM.prototype).forEach((prop) => {
			if(typeof(this[prop]) == "function" && prop.startsWith("handle")) {
				//console.log(prop);
				this[prop] = this[prop].bind(this);
			}
		})
	}
	
	componentDidMount() {
		this.loadone(this.handleLoaded);
	}
	
	loadone(done) {
		if(this.loadindex >= this.state.charKeys.length) {
			return done();
		}
		
		Common.getSave(this.state.charKeys[this.loadindex], (err, char) => {
			this.state.chars[this.state.charKeys[this.loadindex]] = char;
			//this.state.chars.length += 1;
			
			this.loadindex += 1;
			return this.loadone(done);
		});
	}
	
	handleLoaded() {
		this.character_client = Common.client.subscribe('/room/' + this.props.room, (message) => {
			
			//var id = channel.substring('/character/'.length);
			if(message.kind == "character") {
				
				this.state.chars[message.character.id] = message.character;
				this.handleChange();
			}
		});
		
		this.handleChange();
	}
	
	handleChange() {
		this.forceUpdate()
	}
	
	handleTabChange(tab) {
		this.setState({
			activeTab: tab
		});
	}
	
	render() {
		return (
			<GMDeck chars={this.state.chars} charKeys={this.state.charKeys} activeTab={this.state.activeTab} onChange={this.handleChange} onSwitch={this.handleTabChange} room={this.props.room} />
		);
	}
}
