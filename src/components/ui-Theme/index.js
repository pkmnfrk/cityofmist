import React from 'react';
import Icon from '../ui-Icon';
import CheckScale from '../ui-CheckScale';
import Power from '../ui-Power';
import { save, editString } from '../../common';

import './index.css';

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
    
    /*addTheme(themes) {
        var newTheme = JSON.parse(JSON.stringify(template));
        
        themes.push(newTheme);
        save();
    }*/
	
    handleDeletePower(power) {
        for(var i = 0; i < this.props.theme.powertags.length; i++) {
            if(this.props.theme.powertags[i] == power) {
                this.props.theme.powertags.splice(i, 1);
				this.props.onChange()
                break;
            }
        }
    }
    
    handleDeleteWeakness(weak) {
        for(var i = 0; i < theme.weaknesses.length; i++) {
            if(theme.weaknesses[i] == weak) {
                theme.weaknesses.splice(i, 1);
                break;
            }
        }
        
        save();
    }
    
    handleAddPower() {
        var newPower = {
            name: "<new tag>",
            burned: false
        };
        
        this.props.theme.powertags.push(newPower);
        this.props.onChange();
        
    }
    
    handleAddWeakness() {
        var newWeakness = {
            name: "<new tag>"
        }
        
        this.props.theme.weaknesses.push(newWeakness);
        this.props.onChange();
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
	
	handleMysteryClick() {
		if(this.props.isLocked) return;
		
		var newBook = editString(this.props.theme.mystery)
		
		if(this.props.theme.mystery != newBook) {
			this.props.theme.mystery = newBook;
			this.props.onChange();
		}
	}
	
	handleDescriptionClick() {
		if(this.props.isLocked) return;
		
		var newBook = editString(this.props.theme.description)
		
		if(this.props.theme.description != newBook) {
			this.props.theme.description = newBook;
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
					<div className={"name" + (this.props.isLocked ? "" : " editable")} onClick={this.handleNameClick}>{this.props.theme.name}</div>				
					<div className="attention">
						<CheckScale value={this.props.theme.attention} onChange={this.handleAttention} />
						<div className="label"/>
					</div>
					<div className="fade">
						<CheckScale value={this.props.theme.fade} onChange={this.handleFade} />
						<div className="label"/>
					</div>
					<div className="mystery_head">
						{this.props.theme.type == "mythos" ? "Mystery" : "Identity"}:
					</div>
					<div className={"mystery" + (this.props.isLocked ? "" : " editable")} onClick={this.handleMysteryClick}>
						{this.props.theme.mystery}
					</div>
					<div className={"description" + (this.props.isLocked ? "" : " editable")} onClick={this.handleDescriptionClick}>
						{this.props.theme.description}
					</div>
					<div className="powertags_head">
						POWER TAGS
						<Icon icon="plus-circle" className="add" hide={this.props.isLocked} onClick={this.handleAddPower} />
					</div>
					<ul className="powertags">
						{this.props.theme.powertags.map((p, i) => 
							<Power key={i} power={p} isLocked={this.props.isLocked} onChange={this.props.onChange} onDelete={() => this.handleDeletePower(p)} />
						)}
					</ul>
				</div>
			</div>
		);
		/*
        var ret = vnode.attrs.themes.map(t => {
            return m("div", {class: "theme " + t.type}, [

                m("div", {class: "inner"}, [
                    
                    m("div", {class: "powertags_head"}, [
                        "POWER TAGS",
                        m("i[class=fa fa-plus-circle add]", {onclick: () => this.addPower(t)})
                    ]),
                    m("ul", {class: "powertags"},
                        t.powertags.map(
                            p => 
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