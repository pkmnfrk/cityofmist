function editString(t) {
    var n = prompt("Edit", t);
    if(!n) return t;
    return n;
}

var Theme = {
    tapped: false,
    
	toggleType: function(t) {
		if(t == "logos") return "mythos";
		return "logos";
	},
    
    deleteTheme: function(themes, theme) {
        for(var i = 0; i < themes.length; i++) {
            if(themes[i] == theme) {
                themes.splice(i, 1);
                break;
            }
        }
        
        save();
    },
    
    addTheme: function(themes) {
        var newTheme = JSON.parse(JSON.stringify(template));
        
        themes.push(newTheme);
        save();
    },
	
    deletePower: function(theme, power) {
        for(var i = 0; i < theme.powertags.length; i++) {
            if(theme.powertags[i] == power) {
                theme.powertags.splice(i, 1);
                break;
            }
        }
        
        save();
    },
    
    deleteWeakness: function(theme, weak) {
        for(var i = 0; i < theme.weaknesses.length; i++) {
            if(theme.weaknesses[i] == weak) {
                theme.weaknesses.splice(i, 1);
                break;
            }
        }
        
        save();
    },
    
    addPower: function(theme) {
        var newPower = {
            name: "<new tag>",
            burned: false
        };
        
        theme.powertags.push(newPower);
        save();
        
    },
    
    addWeakness: function(theme) {
        var newWeakness = {
            name: "<new tag>"
        }
        
        theme.weaknesses.push(newWeakness);
        save();
    },
    
	view: function(vnode) {
        var ret = vnode.attrs.themes.map(t => {
            return m("div", {class: "theme " + t.type}, [
                m("i[class=close fa fa-times-circle-o fa-2x]", {onclick: () => {
                    if(isLocked()) return;
                    this.deleteTheme(vnode.attrs.themes, t);
                }}),
                
                m("div", {class: "book", onclick: () => {
                    if(isLocked()) return;
                    t.book = editString(t.book);
                    save();
                }}, t.book),
                m("div", {class: "icon", onclick: () => {
                    if(isLocked()) return;
                    t.type = this.toggleType(t.type);
                    save();
                }}, [
                    m("i", {class: "fa fa-fw fa-" + (t.type == "mythos" ? "bolt" : "id-badge" )})
                ]),
                m("div", {class: "inner"}, [
                    m("div", {class: "name", onclick: () => {
                        if(isLocked()) return;
                        t.name = editString(t.name);
                        save();
                    }}, t.name),
                    m("div", {class: "attention"}, [
                        t.attention.map((a,i) => 
                            m("div", {class:"mark"}, [
                                m("input[type=checkbox]", { checked: a, onchange: (e) => {
                                    t.attention[i] = e.target.checked;
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
                                    t.fade[i] = e.target.checked;
                                    save();
                                } })
                            ])
                        ),
                        m("div", {class:"label"})
                    ]),
                    m("div", {class: "mystery_head"}, (t.type == "mythos" ? "Mystery" : "Identity") + ":"),
                    m("div", {class: "mystery", onclick: () => {
                        if(isLocked()) return;
                        t.mystery = editString(t.mystery);
                        save();
                    }}, t.mystery),
                    m("div", {class: "description", onclick: () => {
                        if(isLocked()) return;
                        t.description = editString(t.description);
                        save();
                    }}, t.description),

                    m("div", {class: "powertags_head"}, [
                        "POWER TAGS",
                        m("i[class=fa fa-plus-circle add]", {onclick: () => this.addPower(t)})
                    ]),
                    m("ul", {class: "powertags"},
                        t.powertags.map(
                            p => m("li", 
							{
								class: p.selected || null
							},
							[
                                m("i[class=fa fa-times-circle-o close]", {onclick: () => this.deletePower(t, p)}),
                                
                                m("span",
                                    {
                                        onclick: () => {
                                            if(isLocked()) {
												if(!p.burned) {
													if(!p.selected) {
														p.selected = "plus";
													} else if(p.selected == "plus") {
													//	p.selected = "minus";
													//} else if(p.selected == "minus") {
														delete p.selected;
													}
												}
											} else {
												p.name = editString(p.name);
											}
                                            save();
                                        },
                                        class: p.burned ? "burned" : ""
                                    },
                                    p.name
                                ),
                                m("input[type=checkbox]", {checked: p.burned, onchange: (e) => {
                                    p.burned = e.target.checked;
									if(p.burned) {
										delete p.selected;
									}
                                    save();
                                } })
                            ])
                        )
                    )
                ]), //inner
                m("div", {class: "footer"}, [
                    m("div", {class:"weakness_head"}, [
                        m("span", {
                            /*onclick: function(e) {
                                e.preventDefault();
                                
                                if(!this.tapped) {
                                    setTimeout(() => this.tapped = false, 500);
                                    return;
                                }
                                
                                toggleLocked();
                            },*/
                        }, "WEAKNESS TAGS"),
                        m("i[class=fa fa-plus-circle add]", {onclick: () => this.addWeakness(t) })
                    ]),
                    m("ul", {class: "weaknesses"}, 
                        t.weaknesses.map(w => m("li", 
						{
							class: w.selected || null
						},
						[
                            m("i[class=fa fa-times-circle-o close]", {onclick: () => this.deleteWeakness(t, w)}),
                            m("span", {
								onclick: () => {
									if(isLocked()) {
										if(!w.selected) {
											w.selected = "minus";
										} else if(w.selected == "minus") {
										//	w.selected = "plus";
										//} else if(w.selected == "plus") {
											delete w.selected;
										}
									}
									else 
									{
										w.name = editString(w.name);
									}
									save();
								}
							}, w.name)
                        ]))
                    )
                ])
            ]);
        });
        
        while(ret.length < 4) {
            ret.push(m("button", {
                onclick: () => {
                    this.addTheme(vnode.attrs.themes);
                }
            }, "Add Theme"));
        }
        
        return ret;
    }
};

var Roller = {

    view: function(vnode) {
        var rolls = vnode.attrs.rolls;
        var bonus = 0
		var penalty = 0
		
		if(vnode.attrs.char) {
			for(var theme of vnode.attrs.char.themes) {
				for(var tag of theme.powertags) {
					if(tag.selected == "plus") {
						bonus += 1;
					}
					if(tag.selected == "minus") {
						penalty += 1;
					}
				}
				
				for (var weak of theme.weaknesses) {
					if(weak.selected == "plus") {
						bonus += 1;
					}
					if(weak.selected == "minus") {
						penalty += 1;
					}
				}
			}
			
			for(var status of vnode.attrs.char.statuses) {
				if(status.selected == "plus") {
					bonus += spectrumLevel(status.spectrum);
				}
				if(status.selected == "minus") {
					penalty += spectrumLevel(status.spectrum);
				}
			}
		}
		
        return [
            m("div[class=rollers]", [
                m("button[class=roller]", {onclick: () => { 
					roll("", vnode.attrs.who, vnode.attrs.room, 2, 6, bonus, penalty)
					
					if(vnode.attrs.char) {
						var any = false;
						for(var theme of vnode.attrs.char.themes) {
							for(var tag of theme.powertags) {
								if(tag.selected) {
									any = true;
									delete tag.selected;
								}
							}
							for(var weak of theme.weaknesses) {
								if(weak.selected) {
									any = true;
									delete weak.selected;
								}
							}
						}
						for(var status of vnode.attrs.char.statuses) {
							if(status.selected) {
								delete status.selected;
							}
						}
						
						if(any) {
							save();
						}
					}
					
				}}, "Roll 2d6" + (bonus ? "+" + bonus : "") + (penalty ? "-" + penalty : "")),
                m("ul[id=rolls]", rolls.map((r) => m("li", [
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
                        r.bonus ? [" + ", m("span", {class: "bonus"}, r.bonus)] : [],
                        r.penalty ? [" - ", m("span", {class: "penalty"}, r.penalty)] : [],
                    ]),
                    r.label ? m("span", {class: "label"}, r.label) : ""

                ]))),
                
                isGm() ?
                    m("div[class=music]", [
                        m("input[type=text][id=youtubelink]", { value: "" }),
                        m("button", { onclick: function() {
                            sendVideo(document.getElementById("youtubelink").value);
                        }}, "Send"),
                        m("button", { onclick: function() {
                            
                            setLoop(document.getElementById("shouldloop").checked);
                            playVideo();
                        }}, "Play"),
                        m("button", { onclick: function() {
                            stopVideo();
                        }}, "Stop"),
                        m("button", { onclick: function() {
                            setVolume(5);
                        }}, "Vol: 5%"),
                        m("button", { onclick: function() {
                            setVolume(50);
                        }}, "Vol: 50%"),
                        m("input[type=checkbox][id=shouldloop]", { onchange: function() {
                            setLoop(document.getElementById("shouldloop").checked);
                        }}),
                        m("label[for=shouldloop]", "Should loop")
                        
                    ]) : m("button", { onclick: function() {
                        stopYoutubeVideo();
                    }}, "Stop Music"),
                
                m("div[id=player]")
                
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
            m("div[class=header]", {
				class: status.selected || null,
				onclick: () => {
					if(!status.selected) {
						status.selected = "minus";
					} else if(status.selected == "minus") {
						status.selected = "plus";
					} else if(status.selected == "plus") {
						delete status.selected;
					}
					save();
				}
			},
			[
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
};

var Name = {
    view: function(vnode) {
        var char = vnode.attrs.char;
        
        return [
            m("div[class=name]", { onclick: () => {
                if(!isLocked()) {
                    char.name = editString(char.name);
                    save();
                }
            }}, char.name)
        ];
    }
};

var Deck  = {
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

var GMDeck = {
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
					return {
						name: allchars[c].name,
						moves: allchars[c].moves
					}
				})
			}),
			m(MapScreen)
        ];
    }
};

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

var Move = {
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

var MapScreen = {
	view: function(vnode) {
		
		return m("div[id=map]", [
			m("img[id=mapimg][src=/map]")
		]);
		
	}
}