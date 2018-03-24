import React from 'react';

import Move from '../ui-Move';

export default class MoveSection extends React.Component {
	render() {
		var section = this.props.section;
		
		if(!section.moves) return null;
		
		return (
			<React.Fragment>
				<h1>{section.name}</h1>
				<section>
				{section.moves.map((move, ix) => 
					<Move key={ix} move={move} />
				)}
				</section>
			</React.Fragment>
		);
		
	}
};