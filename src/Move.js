import m from 'mithril';


export default {
	view: function(vnode) {
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