import React from 'react';
import Icon from '../ui-Icon';
import CheckScale from '../ui-CheckScale';

import { save, editString } from '../../common';

export default class Theme extends React.Component {
	constructor(props) {
		super(props);
		
		//this.handleBookClick = this.handleBookClick.bind(this);
		//this.handleIconClick = this.handleIconClick.bind(this);
		//console.log("Properties:");
		Object.getOwnPropertyNames(Theme.prototype).forEach((prop) => {
			if(typeof(this[prop]) == "function" && prop.startsWith("handle")) {
				//console.log(prop);
				this[prop] = this[prop].bind(this);
			}
		})
		/*for(var prop in ) {
			console.log(prop + ": " + typeof(this[prop]));
			if(typeof(this[prop]) == "function" && prop.startsWith("handle")) {
				this[prop] = this[prop].bind(this);
			}
		}*/
	}
	
	toggleType(t) {
		if(t == "logos") return "mythos";
		return "logos";
	}
    
    addTheme(themes) {
        var newTheme = JSON.parse(JSON.stringify(template));
        
        themes.push(newTheme);
        save();
    }
	
    deletePower(theme, power) {
        for(var i = 0; i < theme.powertags.length; i++) {
            if(theme.powertags[i] == power) {
                theme.powertags.splice(i, 1);
                break;
            }
        }
        
        save();
    }
    
    deleteWeakness(theme, weak) {
        for(var i = 0; i < theme.weaknesses.length; i++) {
            if(theme.weaknesses[i] == weak) {
                theme.weaknesses.splice(i, 1);
                break;
            }
        }
        
        save();
    }
    
    addPower(theme) {
        var newPower = {
            name: "<new tag>",
            burned: false
        };
        
        theme.powertags.push(newPower);
        save();
        
    }
    
    addWeakness(theme) {
        var newWeakness = {
            name: "<new tag>"
        }
        
        theme.weaknesses.push(newWeakness);
        save();
    }
	
	handleBookClick() {
		if(this.props.isLocked) return;
		
		var newBook = editString(this.props.theme.book)
		
		if(this.props.theme.book != newBook) {
			this.props.theme.book = newBook;
			this.props.onChange();
		}
	}
	
	handleIconClick() {
		if(this.props.isLocked) return;
		
		this.props.theme.type = this.toggleType(this.props.theme.type);
		this.props.onChange();
	}
	
	handleNameClick() {
		if(this.props.isLocked) return;
		
		var newBook = editString(this.props.theme.name)
		
		if(this.props.theme.name != newBook) {
			this.props.theme.name = newBook;
			this.props.onChange();
		}
	}
	
	handleAttention(v) {
		if(this.props.theme.attention != v) {
			this.props.theme.attention = v;
			this.props.onChange();
		}
	}
	
	handleFade(v) {
		if(this.props.theme.fade != v) {
			this.props.theme.fade = v;
			this.props.onChange();
		}
	}
	
	render() {
		return (
			<div className={"theme " + this.props.theme.type}>
				<Icon
					hide={this.props.isLocked}
					className="close"
					big="true"
					icon="times-circle-o"
					onClick={this.props.onDelete}
				/>
				<div className="book" onClick={this.handleBookClick}>{this.props.theme.book}</div>
				<div className="icon">
					<Icon fixed="true" icon={this.props.theme.type == "mythos" ? "bolt" : "id-badge"} onClick={this.handleIconClick} />
				</div>
				<div className="inner">
					<div className="name" onClick={this.handleNameClick}>{this.props.theme.name}</div>
				</div>
				<div className="attention">
					<CheckScale value={this.props.theme.attention} onChange={this.handleAttention} />
					<div className="label"/>
				</div>
				<div className="fade">
					<CheckScale value={this.props.theme.fade} onChange={this.handleFade} />
					<div className="label"/>
				</div>
			</div>
		);
		/*
        var ret = vnode.attrs.themes.map(t => {
            return m("div", {class: "theme " + t.type}, [

                m("div", {class: "inner"}, [

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
                        m("span", "WEAKNESS TAGS"),
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
		*/
    }
};