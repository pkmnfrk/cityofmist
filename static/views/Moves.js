var Moves = {
	view: function(vnode) {
		var moves = [vnode.attrs.personal, global_moves];
		
		return m("#moves", moves.map(function(set) {
			if(!set) return null;
			
			return set.map(function(section) {
				return m(MoveSection, {section: section});
			});
			
		}));
	}
};