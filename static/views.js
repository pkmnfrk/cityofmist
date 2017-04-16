function editString(t) {
    var n = prompt("Edit", t);
    if(!n) return t;
    return n;
}

var Theme = {
	toggleType: function(t) {
		if(t == "logos") return "mythos";
		return "logos";
	},
	
	view: function(vnode) {
        return vnode.attrs.themes.map(t => {
            return m("div", {class: "theme " + t.type}, [
                m("i[class=close fa fa-times-circle-o fa-2x]"),
                m("div", {class: "book", onclick: () => {
                    t.book = editString(t.book);
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
                        t.name = editString(t.name);
                        save();
                    }}, t.name),
                    m("div", {class: "attention"}, [
                        t.attention.map((a,i) => 
                            m("div", {class:"mark"}, [
                                m("input[type=checkbox]", { checked: a, onchange: (e) => {
                                    t.attention[i] = e.srcElement.checked;
                                    save();
                                } })
                            ])
                        ),
                        m("div", {class:"label"})
                    ]),
                    m("div", {class: "fade"}, [
                        t.fade.map((a,i) => 
                            m("div", {class:"mark"}, [
                                m("input[type=checkbox]", { checked: a, onchange: (e) => {
                                    t.fade[i] = e.srcElement.checked;
                                    save();
                                } })
                            ])
                        ),
                        m("div", {class:"label"})
                    ]),
                    m("div", {class: "mystery_head"}, (t.type == "mythos" ? "Mystery" : "Identity") + ":"),
                    m("div", {class: "mystery", onclick: () => {
                        t.mystery = editString(t.mystery);
                        save();
                    }}, t.mystery),
                    m("div", {class: "description", onclick: () => {
                        t.description = editString(t.description);
                        save();
                    }}, t.description),

                    m("div", {class: "powertags_head"}, [
                        "POWER TAGS",
                        m("i[class=fa fa-plus-circle add]", {onclick: () => {}})
                    ]),
                    m("ul", {class: "powertags"},
                        t.powertags.map(
                            p => m("li", [
                                m("i[class=fa fa-times-circle-o close]", {onclick: () => {}}),
                                
                                m("span",
                                    {onclick: () => {
                                        p.name = editString(p.name);
                                        save();
                                    }},
                                    p.name
                                ),
                                m("input[type=checkbox]", {checked: p.burned, onchange: (e) => {
                                    p.burned = e.srcElement.checked;
                                    save();
                                } })
                            ])
                        )
                    )
                ]), //inner
                m("div", {class: "footer"}, [
                    m("div", {class:"weakness_head"}, [
                        "WEAKNESS TAGS",
                        m("i[class=fa fa-plus-circle add]", {onclick: () => {}})
                    ]),
                    m("ul", {class: "weaknesses"}, 
                        t.weaknesses.map(w => m("li", {onclick: () => {
                            w.name = editString(w.name);
                            save();
                        }}, [
                            m("i[class=fa fa-times-circle-o close]", {onclick: () => {}}),
                            w.name
                        ]))
                    )
                ])
            ]);
        });
    }
};

var Roller = {
    rolls: [],
    
    view: function(vnode) {
        
        return [
            m("div", {class: "rollers"}, [
                m("button", {class: "roller", onclick: () => { roll("roll", 2, 6)}}, "Roll 2d6"),
                m("button", {class: "roller", onclick: () => { roll("+mythos", 2, 6, Deck.deck.filter(o => o.type == "mythos").length)}}, "Roll +Mythos"),
                m("button", {class: "roller", onclick: () => { roll("+logos", 2, 6, Deck.deck.filter(o => o.type == "logos").length)}}, "Roll +Logos"),
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

                ])))
            ])
        ]
        
    }
}

var Status = {
    statusCheck: function(status, i) {
        return (e) => {
            status.spectrum = i + 1;
            
            save();
        };
    },
    
    viewCheckbox: function(status, i) {
        return m("div", {class: status.spectrum > i ? "shaded" : "", onclick: this.statusCheck(status, i)})
    },
    
    viewCheckboxes: function(status) {
        var ret = [];
        for(var i = 0; i < 16; i++) {
            ret.push(this.viewCheckbox(status, i));
        }
        return ret;
    },
    
    viewSpectrumLabels: function(status) {
        var pips = [0, 0, 1, 2, 3, 4];
        
        var ret = [];
        var x = 0;
        for(var i = 0; i < 6; i++) {
            var col = [];
            
            for(var j = 0; j < pips[i]; j++) {
                col.push(m("div[class=label]"));
                col.push(m("div"));
                col.push(m("div[class=number]"));
                
                ret.push(m("div",{class: "col " + (status.spectrum > x ? "shaded" : ""), onclick: this.statusCheck(status, x)}, col));
                x += 1;
                col = [];
            }
            
            if(i == 4) {
                col.push(m("div[class=label]", "OUT"));
            } else if(i == 5) {
                col.push(m("div[class=label]", "MC"));
            } else {
                col.push(m("div[class=label]"));
            }
            
            col.push(m("div"));
            col.push(m("div[class=number]", "" + (i + 1)));
            ret.push(m("div",{class: "col " + (status.spectrum > x ? "shaded" : ""), onclick: this.statusCheck(status, x)}, col));
            x += 1;
            
        }
        return ret;
    },
    
    viewTags: function(status) {
        
        
        var ret = [];
        
        for(var i = 0; i < 16; i++) {
            var label = "";
            if(i == 10) label = "OUT";
            if(i == 15) label = "MC"
            ret.push(m("div", { class: "label" + (status.spectrum > i ? " shaded" : ""), onclick: this.statusCheck(status, i) }, label));
            
        }
        return ret;
    },
    
    view: function(vnode) {
        var status = vnode.attrs.status;
        return m("div[class=status]", [
            m("i[class=fa fa-2x fa-times-circle-o close]", {onclick: vnode.attrs.del}),
            m("div[class=header]", [
                "STATUS SPECTRUM CARD",
            ]),
            m("div[class=inner]", this.viewSpectrumLabels(status)),
            m("div[class=tagwrap]", [
                m("div[class=taglabel]", "TAG"),
                m("div[class=tag]", {onclick: () => {
                    status.name = editString(status.name);
                    save();
                }}, status.name),
            ]),
            m("div[class=help]", "When you get a status, mark its tier. When you get another on the same spectrum: A greater tier replaces the current; an equal tier increases the current by 1; for a smaller tier, mark a number of boxes equal to its tier right of the current mark and if you hit the next tier up, it replaces the current.")
        ]);
    }
}

var Statuses = {
    deleteStatus: function(statuses, status) {
        for(var i = 0; i < statuses.length; i++) {
            if(statuses[i] == status) {
                statuses.splice(i, 1);
                break;
            }
        }
        
        save();
    },
    
    addStatus: function(statuses) {
        var newStatus = {
            spectrum: 1
        };
        
        statuses.push(newStatus);
        
        save();
    },
    
    view: function(vnode) {
        var statuses = vnode.attrs.statuses;
        
        return [
            statuses.map(s =>
                m(Status, {
                    status: s,
                    del: () => {
                        this.deleteStatus(statuses, s);
                    }
                })
             
            ),
            m("button[class=newstatus]", {onclick: () => {this.addStatus(statuses)}}, "Add status")
        ];
    }
}

var Deck  = {
	view: function(vnode) {
		return [
            m(Theme, {themes: vnode.attrs.themes}),
            m(Roller),
            m(Statuses, {statuses: vnode.attrs.statuses})
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