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
		if(this.loadindex >= this.props.characterKeys.length) {
			return done();
		}
		
		Common.getSave(this.props.characterKeys[this.loadindex], (err, char) => {
			this.state.chars[this.props.characterKeys[this.loadindex]] = char;
			//this.state.chars.length += 1;
			
			this.loadindex += 1;
			return this.loadone(done);
		});
	}
	
	handleLoaded() {
		this.character_client = Common.client.subscribe('/character/*').withChannel((channel, message) => {
			
			var id = channel.substring('/character/'.length);
			
			this.state.chars[id] = message;
			
			
			
			this.handleChange();
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
			<GMDeck chars={this.state.chars} charKeys={this.props.characterKeys} activeTab={this.state.activeTab} onChange={this.handleChange} onSwitch={this.handleTabChange} />
		);
	}
}
