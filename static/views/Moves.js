var Moves = {
	view: function(vnode) {
		var moves = [global_moves, vnode.attrs.personal];
		
		return m("#moves", moves.map(function(set) {
			if(!set) return null;
			
			return set.map(function(section) {
				return m(MoveSection, {section: section});
			});
			
		}));
	}
};