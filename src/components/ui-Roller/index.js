import React from 'react';
import Roll from '../ui-Roll';
import Icon from '../ui-Icon';

import "./index.css"

import { isGm, client, spectrumLevel, sendRoll } from '../../common';

var listeners = [];

var rolls = {
	/*main: [{
		total: 11,
		who: "Mike",
		when: new Date().getTime(),
		dice: [1,2,3],
		dropped: [2],
		bonus: 9,
		penalty: 1
	}]*/
};

var rolls_client = client.subscribe('/room/*').withChannel((channel, message) => {
	if(message.kind != "roll") return;
	
	var room = channel.substring(6);
	
	if(!rolls[room]) {
		rolls[room] = [];
	}
	
	rolls[room].unshift(message.roll);
	
	while(rolls[room].length > 15) {
		rolls[room].pop();
	}
	
	for(var l of listeners) {
		l(room);
	}
});

export default class Roller extends React.Component {
	constructor(props) {
		super(props);
		
		if(!rolls[this.props.room]) {
			rolls[this.props.room] = [];
		}
		
		this.state = {
			rolls: rolls[this.props.room]
		}
		
		this.roll = this.roll.bind(this);
		this.handleRollUpdate = this.handleRollUpdate.bind(this);
	}
	
	handleRollUpdate(room) {
		if(room == this.props.room) {
			this.setState({
				rolls: rolls[room]
			});
		}
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

	roll(advantage) {
		this.doRoll("", this.props.who, this.props.room, 2, 6, this.getBonus(), this.getPenalty(), advantage);
		this.clearSelections();
	}
	
	doRoll(label, who, room, nDice, nSides, bonus, penalty, advantage) {
		var dice = [];
		var dropped = [];
		var total = 0;
		
		var lowest = -1;
		var highest = -1;
		
		if(advantage) {
			nDice += 1;
		}
		
		for(var i = 0; i < nDice; i++) {
			var d = Math.floor(Math.random() * nSides) + 1;
			dice.push(d);
			
			if(lowest == -1 || (lowest !== -1 && d < dice[lowest])) {
				lowest = i;
			}
			if(highest == -1 || (highest !== -1 && d > dice[highest])) {
				highest = i;
			}
		}
		
		console.log("Lowest: " + lowest);
		console.log("Highest: " + highest);
		
		if(advantage == "advantage") {
			dropped.push(lowest);
		} else if(advantage == "disadvantage") {
			dropped.push(highest);
		}
		
		for(var i = 0; i < dice.length; i++) {
			if(dropped.indexOf(i) === -1) {
				total += dice[i];
			}
		}
		
		if(bonus) {
			total += bonus;
		}
		if(penalty) {
			total -= penalty;
		}
		
		var message = {
			label: label,
			when: Date.now(),
			who: who,
			dice: dice,
			bonus: bonus,
			penalty: penalty,
			total: total,
			advantage: advantage,
			dropped: dropped
		};
		
		//client.publish('/rolls/' + room, message);
		sendRoll(room, message);
	}
	
    render() {
        
        var bonus = this.getBonus();
		var penalty = this.getPenalty();
		
		return (
			<div className="rollers">
				<div className="rollButtons">
					<button className="advantage" onClick={() => this.roll("disadvantage")}>
						<Icon outline icon="thumbs-down" />
					</button>
					<button className="roller" onClick={() => this.roll()}>
						Roll 2d6 {(bonus ? "+" + bonus : "") + (penalty ? "-" + penalty : "")}
					</button>
					<button className="advantage" onClick={() => this.roll("advantage")}>
						<Icon outline icon="thumbs-up" />
					</button>
				</div>
				<ul id="rolls">
				{this.state.rolls.map((r) => <Roll key={r.when} roll={r} />)}
				</ul>
			</div>
		);
        
    }
}
