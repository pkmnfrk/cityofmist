import m from 'mithril';

import * as Common from './common'; 
import GlobalMoves from './GlobalMoves';
import MoveSection from './MoveSection';

export default {
	view: function(vnode) {
		var moves = [vnode.attrs.personal, GlobalMoves];
		
		return m("#moves", moves.map(function(set) {
			if(!set) return null;
			
			return set.map(function(section) {
				return m(MoveSection, {section: section});
			});
			
		}));
	}
};