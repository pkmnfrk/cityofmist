import React from 'react'
import GMDeck from '../ui-GMDeck';

import * as Common from "../../common";

export default class GM extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			chars: {},
			activeTab: this.props.activeTab,
		}
		
		this.loadindex = 0;
		this.charKeys = [];
		
		Object.getOwnPropertyNames(GM.prototype).forEach((prop) => {
			if(typeof(this[prop]) == "function" && prop.startsWith("handle")) {
				//console.log(prop);
				this[prop] = this[prop].bind(this);
			}
		})
	}
	
	componentDidMount() {
		//this.loadone(this.handleLoaded);
		Common.getRoom(this.props.room, (err, data) => {
			this.charKeys = data.characters
			this.loadindex = 0;
			this.loadone(() => {
				this.handleLoaded();
			});
		});
	}
	
	loadone(done) {
		if(this.loadindex >= this.charKeys.length) {
			return done();
		}
		
		Common.getSave(this.props.room, this.charKeys[this.loadindex], (err, char) => {
			this.state.chars[this.charKeys[this.loadindex]] = char;
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
			else if(message.kind == "room")
			{
				this.charKeys = message.room.characters;
				this.loadindex = 0;
				this.loadone(() => {
					this.handleChange();
				});
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
			<GMDeck chars={this.state.chars} charKeys={this.charKeys} activeTab={this.state.activeTab} onChange={this.handleChange} onSwitch={this.handleTabChange} room={this.props.room} />
		);
	}
}
