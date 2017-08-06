var TabSwitcher = {
	active: null,
	view: function(vnode) {
		var tabs = vnode.attrs.tabs;
		var onswitch = vnode.attrs.onswitch;
		
		if(!TabSwitcher.active) {
			TabSwitcher.active = vnode.attrs.activetab
		}
		if(!TabSwitcher.active) {
			TabSwitcher.active = tabs[0].id;
		}
		
		return m(".tabswitcher", tabs.map(function(t, i) {
			var update = function() {
				var dom = document.getElementById(t.id);
				if(t.id != TabSwitcher.active && dom) {
					dom.style.display = "none";
				} else if(dom) {
					dom.style.display = null;
					TabSwitcher.title = t.label;
				}
			};
			return m(".tab", {
				"class": t.id == TabSwitcher.active ? "active" : "inactive",
				onclick: function() {
					TabSwitcher.active = t.id;
					if(onswitch) onswitch(t.id, t.label);
					draw();
				},
				onupdate: update,
				oncreate: update
			}, t.label);
			
		}));
	}
};