import React from 'react';
import Roll from '../ui-Roll';

import { roll, isGm, client, spectrumLevel } from '../../common';

var listeners = [];

var rolls = [{
	total: 11,
	who: "Mike",
	when: new Date().getTime(),
	dice: [1,2],
	bonus: 9,
	penalty: 1
}];

var rolls_client = client.subscribe('/rolls/*').withChannel((channel, message) => {

	rolls.unshift(message);
	while(rolls.length > 15) {
		rolls.pop();
	}
	
	for(var l of listeners) {
		l();
	}
});

export default class Roller extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			rolls: rolls
		}
		
		this.roll = this.roll.bind(this);
		this.handleRollUpdate = this.handleRollUpdate.bind(this);
	}
	
	handleRollUpdate() {
		this.setState({
			rolls: rolls
		});
	}
	
	componentDidMount() {
		listeners.push(this.handleRollUpdate);
	}
	
	componentWillUnmount() {
		for(var i in listeners) {
			if(listeners[i] == this.handleRollUpdate) {
				listeners.splice(i, 1);
				break;
			}
		}
	}
	
	clearSelections() {
		if(this.props.char) {
			var any = false;
			for(var theme of this.props.char.themes) {
				for(var tag of theme.powertags) {
					if(tag.selected) {
						any = true;
						delete tag.selected;
					}
				}
				for(var weak of theme.weaknesses) {
					if(weak.selected) {
						any = true;
						delete weak.selected;
					}
				}
			}
			for(var status of this.props.char.statuses) {
				if(status.selected) {
					any = true;
					delete status.selected;
				}
			}
			
			if(any) {
				this.props.onChange();
			}
		}
	}
	
	getRollAttribute(kind) {
		var ret = 0;
		
		if(this.props.char) {
			for(var theme of this.props.char.themes) {
				for(var tag of theme.powertags) {
					if(tag.selected == kind) {
						ret += 1;
					}
				}
				
				for (var weak of theme.weaknesses) {
					if(weak.selected == kind) {
						ret += 1;
					}
				}
			}
			
			for(var status of this.props.char.statuses) {
				if(status.selected == kind) {
					ret += spectrumLevel(status.spectrum);
				}
			}
		}
		
		return ret;
	}
	
	getBonus() {
		return this.getRollAttribute("plus");
	}
	
	getPenalty() {
		return this.getRollAttribute("minus");
	}

	roll() {
		roll("", this.props.who, this.props.room, 2, 6, this.getBonus(), this.getPenalty());
		this.clearSelections();
	}
	
    render() {
        
        var bonus = this.getBonus();
		var penalty = this.getPenalty();
		
		return (
			<div className="rollers">
				<button className="roller" onClick={this.roll}>
					Roll 2d6 {(bonus ? "+" + bonus : "") + (penalty ? "-" + penalty : "")}
				</button>
				<ul id="rolls">
				{rolls.map((r) => <Roll key={r.when} roll={r} />)}
				</ul>
			</div>
		);
        
    }
}
