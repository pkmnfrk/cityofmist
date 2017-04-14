var Theme = {
	data: null,
	toggleType: function(t) {
		if(t == "logos") return "mythos";
		return "logos";
	},
	
	editString: function(t) {
		var n = prompt("Edit", t);
		if(!n) return t;
		return n;
	},
	
	
	view: function(vnode) {
		var t = vnode.attrs.theme;
		
		return m("div", {class: "theme " + t.type}, [
			m("div", {class: "book", onclick: () => {
				t.book = this.editString(t.book);
				save();
			}}, t.book),
			m("div", {class: "icon", onclick: () => {
				t.type = this.toggleType(t.type);
				save();
			}}, [
				m("i", {class: "fa fa-fw fa-" + (t.type == "mythos" ? "bolt" : "id-badge" )})
			]),
			m("div", {class: "inner"}, [
				m("div", {class: "name", onclick: () => {
					t.name = this.editString(t.name);
					save();
				}}, t.name),
				m("div", {class: "attention"}, [
					t.attention.map(a => 
						m("div", {class:"mark"}, [
							m("input[type=checkbox]", { checked: a, onchange: () => {
								save();
							} })
						])
					),
					m("div", {class:"label"})
				]),
				m("div", {class: "fade"}, [
					t.fade.map(a => 
						m("div", {class:"mark"}, [
							m("input[type=checkbox]", { checked: a, onchange: () => {
								save();
							} })
						])
					),
					m("div", {class:"label"})
				]),
				m("div", {class: "mystery_head"}, (t.type == "mythos" ? "Mystery" : "Identity") + ":"),
				m("div", {class: "mystery", onclick: () => {
					t.mystery = this.editString(t.mystery);
					save();
				}}, t.mystery),
				m("div", {class: "description", onclick: () => {
					t.description = this.editString(t.description);
					save();
				}}, t.description),
				
				m("div", {class: "powertags_head"}, "POWER TAGS"),
				m("ul", {class: "powertags"},
					t.powertags.map(
						p => m("li", [
							m("span",
								{onclick: () => {
									p.name = this.editString(p.name);
									save();
								}},
								p.name
							),
							m("input[type=checkbox]", {checked: p.burned, onchange: () => {
								save();
							} })
						])
					)
				)
			]), //inner
			m("div", {class: "footer"}, [
				m("div", {class:"weakness_head"}, "WEAKNESS TAGS"),
				m("ul", {class: "weaknesses"}, 
					t.weaknesses.map(w => m("li", {onclick: () => {
						w.name = this.editString(w.name);
						save();
					}}, w.name))
				)
			])
		]);
	}
};

var Roller = {
    rolls: [],
    
    view: function(vnode) {
        
        return [
            m("ul", {id: "rolls"}, this.rolls.map((r) => m("li", [
                "(",
                new Date(r.when).toLocaleTimeString(),
                ") ",
                r.who,
                ": ",
                m("span", {class: "total"}, r.total),
                m("span", {class: "math"}, [
                    r.dice.reduce((a, v) => {
                        if(a.length) {
                            a.push(" + ");
                        }

                        a.push(m("span", {class: "die"}, v));

                        return a;

                    }, []),
                    typeof r.bonus == "number" ? [" + ", m("span", {class: "bonus"}, r.bonus)] : [],
                    typeof r.penalty == "number" ? [" - ", m("span", {class: "penalty"}, r.penalty)] : [],
                ]),
                m("span", {class: "label"}, r.label)
                
            ]))),
            m("div", {class: "rollers"}, [
                m("button", {class: "roller", onclick: () => { roll("roll", 2, 6)}}, "Roll 2d6"),
                m("button", {class: "roller", onclick: () => { roll("+mythos", 2, 6, Deck.deck.filter(o => o.type == "mythos").length)}}, "Roll +Mythos"),
                m("button", {class: "roller", onclick: () => { roll("+logos", 2, 6, Deck.deck.filter(o => o.type == "logos").length)}}, "Roll +Logos"),
            ])
        ]
        
    }
}

var Deck  = {
	deck: null,
	
	view: function(vnode) {
		return [
            this.deck.map((o) => m(Theme, { theme: o })),
            m(Roller)
        ]
	}
};

/*
var objs = [
{
    type: "mythos",
    book: "Adaptation",
    name: "Living in a Dream",
    attention: [true, false, false],
    fade: [false, false, false],
    mystery: "Who is guiding the dream?",
    description: "The world around Declan changes like a dream; he can open a door at home and find himself in a marketplace or suddenly become invisible without warning.",
    powertags: [
        {
            name: "Mysterious reality bending",
            burned: false
        },
        {
            name: "Subconcious reaction speed",
            burned: false
        },
        {
            name: "Premonitions",
            burned: false
        }
    ],

    weaknesses: [
        {
            name: "No conscious control of dreams"
        }
    ]
},
{
    type: "logos",
    book: "Occupation",
    name: "Dubious Antiques Dealer",
    attention: [false, false, false],
    fade: [false, false, false],
    mystery: "The Ancients knew something, and I'm going to find out what.",
    description: "Declan searches after ancient artifacts or texts that will explain the mysterious force that guides him. To do so, he has set up a thriving antiques shop.",
    powertags: [
        {
            name: "Archaeologist",
            burned: false
        },
        {
            name: "Smuggling",
            burned: false
        },
        {
            name: "Business connections",
            burned: false
        }
    ],

    weaknesses: [
        {
            name: "Black market heat"
        }
    ]
},
JSON.parse(JSON.stringify(template)),
JSON.parse(JSON.stringify(template))
]*/