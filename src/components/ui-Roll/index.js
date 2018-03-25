import React from 'react';
import Icon from '../ui-Icon';

export default class Roll extends React.Component {
	
	render() {
		var x = 0;
		var dice = this.props.roll.dice.reduce((a, v) => {
			if(a.length) {
				a.push(" + ");
			}
			var className = "die";
			
			if(this.props.roll.dropped.indexOf(x) !== -1) {
				className += " dropped";
			}
			
			a.push(<span key={x++} className={className}>{v}</span>)

			return a;

		}, []);
		
		if(this.props.roll.bonus) {
			dice.push(<span key="bonus" className="bonus"> + {this.props.roll.bonus}</span>);
		}
		
		if(this.props.roll.penalty) {
			dice.push(<span key="penalty" className="penalty"> - {this.props.roll.penalty}</span>);
		}
		
		var icon = null;
		if(this.props.roll.advantage == "advantage") {
			icon = <Icon outline icon="thumbs-up" />;
		} else if(this.props.roll.advantage == "disadvantage") {
			icon = <Icon outline icon="thumbs-down" />;
		}
						
		return (<li>
			({new Date(this.props.roll.when).toLocaleTimeString()}){" "}
			{this.props.roll.who}:
			<span className="total">{this.props.roll.total}</span>
				{icon}
			<span className="math">
			{dice}
			</span>
		</li>);
	}
	
}