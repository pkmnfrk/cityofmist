import m from 'mithril';

import { save, isLocked, editString } from './common';

export default {
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