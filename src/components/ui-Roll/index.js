import React from 'react';

export default class Roll extends React.Component {
	
	render() {
		var x = 0;
		var dice = this.props.roll.dice.reduce((a, v) => {
			if(a.length) {
				a.push(" + ");
			}

			a.push(<span key={x++} className="die">{v}</span>)

			return a;

		}, []);
		
		if(this.props.roll.bonus) {
			dice.push(<span key="bonus" className="bonus"> + {this.props.roll.bonus}</span>);
		}
		
		if(this.props.roll.penalty) {
			dice.push(<span key="penalty" className="penalty"> - {this.props.roll.penalty}</span>);
		}
						
		return (<li>
			({new Date(this.props.roll.when).toLocaleTimeString()}){" "}
			{this.props.roll.who}:
			<span className="total">{this.props.roll.total}</span>
			<span className="math">
			{dice}
			</span>
		</li>);
	}
	/*
	m("ul[id=rolls]", rolls.map((r) => m("li", [
                    "(",
                    new Date(r.when).toLocaleTimeString(),
                    ") ",
                    r.who,
                    ": ",
                    m("span", {class: "total"}, r.total),
                    m("span", {class: "math"}, [
                        r.dice.reduce((a, v) => {
                            if(a.length) {
                                a.push(" + ");
                            }

                            a.push(m("span", {class: "die"}, v));

                            return a;

                        }, []),
                        r.bonus ? [" + ", m("span", {class: "bonus"}, r.bonus)] : [],
                        r.penalty ? [" - ", m("span", {class: "penalty"}, r.penalty)] : [],
                    ]),
                    r.label ? m("span", {class: "label"}, r.label) : ""

                ])))
				*/
}