import React from 'react';

import GlobalMoves from '../../GlobalMoves';
import MoveSection from '../ui-MoveSection';

export default class MoveList extends React.Component {
	render() {
		var moves = [this.props.personal, GlobalMoves];
		
		var ret = [];
		var ix = 1;
		
		for(var set of moves)
		{
			for(var section of set) {
				ret.push(<MoveSection key={ix++} section={section} />);
			}
		}
		
		return (
			<div id="moves">
			{ret}
			</div>
		);
	}
};