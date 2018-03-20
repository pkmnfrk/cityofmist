import m from 'mithril';
import Name from './components/ui-Name';
import TabSwitcher from './components/ui-TabSwitcher';
import Theme from './components/ui-Theme';
import Roller from './components/ui-Roller';
import Statuses from './components/ui-StatusList';
import Moves from './components/ui-MoveList';
import MapScreen from './MapScreen';
//import { firstName, toggleLocked } from './common';

export default {
    spectrum: function(s) {
        if(s <= 1) return "1";
        if(s <= 2) return "2";
        if(s <= 3) return "2 + " + (s - 2);
        if(s <= 4) return "3";
        if(s <= 6) return "3 + " + (s - 4);
        if(s <= 7) return "4";
        if(s <= 10) return "4 + " + (s - 7);
        if(s <= 11) return "5";
        if(s <= 15) return "5 + " + (s - 11);
        if(s <= 16) return "6";
    },
    view: function(vnode) {
        var allchars = vnode.attrs.chars;
        var allcharkeys = Object.keys(allchars);
		
        return [
			m(TabSwitcher, {
				tabs: [
					{
						id: "main",
						label: "Characters"
					},
					{
						id: "map",
						label: "Map"
					},
					{
						id: "moves",
						label: "Moves"
					}
				]
			}),
			m("#main", {
				style: "grid-template-columns: repeat(" + (allcharkeys.length + 1) + ", 1fr)"
			}, [
				m(Roller, {rolls: vnode.attrs.rolls, who: "GM", room: "GM" }),
				allcharkeys.map((k) => {return {
					who: k,
					char: allchars[k]
				}}).map((c) => m("div[class=player]", [
					m("div[class=human]", [
						"Player: ",
						m("a", { href: "/?" + c.who }, c.who)
					]),
					m("div[class=name]", ["Name: ", c.char.name]),
					m("div", [
						"Themes:",
						m("ul[class=themes]", c.char.themes.map((t) => m("li", {class: t.type }, [
							t.name,
							m("span[class=attention]", t.attention.map((a) => {
								if(a) 
									return m("i[class=fa fa-check-square-o]")
								else
									return m("i[class=fa fa-square-o]")
							})),
							m("span[class=fade]", t.fade.map((a) => {
								if(a) 
									return m("i[class=fa fa-times-circle-o]")
								else
									return m("i[class=fa fa-circle-o]")
							})),
							m("ul[class=powers]", t.powertags.map((p) => m("li", { class: (p.burned ? "burned ": " ") + (p.selected || "") }, p.name))),
							m("ul[class=weaknesses]", t.weaknesses.map((w) => m("li", { class: w.selected }, w.name)))

							//m("input[type=checkmark]", {checked: p.burned})
						])))
					] ),
					
					m("div", [
						"Statuses:",
						m("ul[class=statuses]", c.char.statuses.map((s) => m("li", {class: (s.spectrum >= 11 ? "danger " : " ") + (s.selected || "")}, [
							s.name,
							" - ",
							this.spectrum(s.spectrum)
						])))
					] )
				]))
			]),
			m(Moves, {
				personal: allcharkeys.map(function(c) {
					var ret = allchars[c].moves.map(function(d) {
						return {
							name: allchars[c].name + ' - ' + d.name,
							moves: d.moves
						}	
					});
					return ret;
					
				}).reduce(function(a, b){ return a.concat(b); }, [])
			}),
			m(MapScreen)
        ];
    }
};