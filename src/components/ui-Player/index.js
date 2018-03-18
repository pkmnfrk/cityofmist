import React from 'react';

import Deck from '../ui-Deck';
import * as Common from '../../common';
import './index.css';

var template = {
    type: "logos",
    book: "<type>",
    name: "<name>",
    attention: [false, false, false],
    fade: [false, false, false],
    mystery: "<identity/mystery here>",
    description: "<description here>",
    powertags: [
        {
            name: "<first power tag>",
            burned: false
        },
        {
            name: "<second power tag>",
            burned: false
        },
        {
            name: "<third power tag>",
            burned: false
        }
    ],

    weaknesses: [
        {
            name: "<weakness tag>"
        }
    ]
}


export default class Player extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			player: null,
			currentTab: "main",
			isLocked: true
		};
		
		this.handleOnSwitchTab = this.handleOnSwitchTab.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	
	componentDidMount() {
		Common.getSave(this.props.room, (err, data) => {
			if(err) {
				data = {
					name: "<character name>",
					themes: [
						JSON.parse(JSON.stringify(template)),
						JSON.parse(JSON.stringify(template)),
						JSON.parse(JSON.stringify(template)),
						JSON.parse(JSON.stringify(template))
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
			this.setState({
				player: message
			});
		});
		
	}
	
	componentWillUnmount() {
		
		this.characterClient.unsubscribe();
		
	}
	
	handleOnSwitchTab(tab) {
		this.setState({
			currentTab: tab
		});
	}
	
	handleSave() {
		if(this.state.player != null) {
			Common.putSave(this.props.room, this.state.player);
		}
	}
	
	handleKeyPress(e) {
		e = e || window.event;
    
		if(e.key == "l") {
			this.setState({
				isLocked: !this.state.isLocked
			})
		}		
	}
	
	render() {
		if(this.state.player != null) {
			return (
				<Deck char={this.state.player} activeTab={this.state.currentTab} onSwitch={this.handleOnSwitchTab} room={this.props.room} onChange={this.handleSave} isLocked={this.state.isLocked} />
			);
		}
		
		return <div>Loading...</div>;
	}
}