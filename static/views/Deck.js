var Deck = {
	view: function(vnode) {
		return [
			m(TabSwitcher, {
				tabs: [
					{
						id: "main",
						label: "Character"
					},
					{
						id: "map",
						label: "Map"
					},
					{
						id: "moves",
						label: "Moves"
					},
					
				],
				activetab: vnode.attrs.activetab,
				onswitch: vnode.attrs.onswitch
			}),
			m("#main", [
				m(Name, {char: vnode.attrs.char}),
				m(Theme, {themes: vnode.attrs.char.themes}),
				m(Roller, {rolls: vnode.attrs.rolls, who: firstName(vnode.attrs.char.name), room: myRoom, char: vnode.attrs.char }),
				m(Statuses, {statuses: vnode.attrs.char.statuses}),
				m("button[class=unlock]", { onclick: () => {toggleLocked()}}, "Lock/unlock themes")
			]),
			m(Moves, {
				personal: vnode.attrs.char.moves
			}),
			m(MapScreen)
        ];
	}
};