import m from 'mithril';

export default {
	view: function(vnode) {
		
		return m("div[id=map]", [
			m("img", { id: "mapimg", src: "/api/map" })
		]);
		
	}
}