import React from 'react';
import Roll from '../ui-Roll';
import Icon from '../ui-Icon';

import "./index.css"

import { isGm, client, spectrumLevel, sendRoll, getRoom } from '../../common';

export default class Roller extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			rolls: []
		}
		
		this.roll = this.roll.bind(this);
	}

	
	componentDidMount() {
		
		this.rolls_client = client.subscribe('/room/' + this.props.room, (message) => {
			if(message.kind == "room") {
				this.setState({
					rolls: message.room.rolls
				});
			}
		});
		
		getRoom(this.props.room, (err, data) => {
			this.setState({
				rolls: data.rolls
			})
		});
	}
	
	componentWillUnmount() {
		this.rolls_client.unsubscribe();

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
				if(status.statuses) {
					for(var sub of status.statuses) {
						if(sub.selected) {
							delete sub.selected;
							any = true;
						}
					}
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
				if(status.statuses) {
					for(var sub of status.statuses) {
						if(sub.selected == kind) {
							ret += sub.type == "status" ? spectrumLevel(sub.spectrum) : 1;
						}
					}
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
