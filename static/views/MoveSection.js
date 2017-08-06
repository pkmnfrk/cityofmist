var MoveSection = {
	view: function(vnode) {
		var section = vnode.attrs.section;
		
		if(!section.moves) return null;
				
		return [
			m("h1", section.name),
			m("section", section.moves.map(function(move) {
				return m(Move, move);
			}))
		]; 
	}
};