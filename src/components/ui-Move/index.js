import React from 'react';


export default class Move extends React.Component {
	
	examples() {
		if(!this.props.move.examples || !this.props.move.examples.length) return null;
		
		return (
			<React.Fragment>
				<div className="actions">ACTIONS</div>
				<ul className="examples">
				{this.props.move.examples.map((ex, ix) => 
					<li key={ix}>{ex}</li>
				)}
					<li>etc.</li>
				</ul>
			</React.Fragment>);
	}
	
	render() {
		var move = this.props.move;
		
		return (
			<div className="move">
				<h2>{move.name}</h2>
				<div className="body" dangerouslySetInnerHTML={{__html: move.text}}/>
				{this.examples()}
			</div>
		);
	}
	
	view(vnode) {
		var move = vnode.attrs;
		
		return m(".move", [
			m("h2", move.name),
			m(".body", m.trust(move.text)),
			move.examples && move.examples.length
				? [
					m(".actions", "ACTIONS"),
					m("ul.examples", [
						move.examples.map(function(ex) {
							return m("li", ex)
						}),
						m("li", "etc.")
					])
				]
				: null
		]);
	}
};