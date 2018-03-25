import React from 'react';
import Icon from '../ui-Icon';
import CheckScale from '../ui-CheckScale';
import Power from '../ui-Power';
import { save, editString } from '../../common';

import './index.css';

export function template() {
	
	return {
		type: "logos",
		book: "<type>",
		name: "<name>",
		attention: [false, false, false],
		fade: [false, false, false],
		mystery: "<identity/mystery here>",
		description: "<description here>",
		powertags: [
			{
				name: "<first power tag>",
				burned: false
			},
			{
				name: "<second power tag>",
				burned: false
			},
			{
				name: "<third power tag>",
				burned: false
			}
		],

		weaknesses: [
			{
				name: "<weakness tag>"
			}
		]
	};
}

export default class Theme extends React.Component {
	constructor(props) {
		super(props);
		
		Object.getOwnPropertyNames(Theme.prototype).forEach((prop) => {
			if(typeof(this[prop]) == "function" && prop.startsWith("handle")) {
				//console.log(prop);
				this[prop] = this[prop].bind(this);
			}
		})
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
        for(var i = 0; i < this.props.theme.weaknesses.length; i++) {
            if(this.props.theme.weaknesses[i] == weak) {
                this.props.theme.weaknesses.splice(i, 1);
				this.props.onChange()
                break;
            }
        }
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
					big
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
							<Power
								key={i}
								power={p}
								isLocked={this.props.isLocked}
								onChange={this.props.onChange}
								onDelete={() => this.handleDeletePower(p)}
								canBurn={true}
								canPlus={true}
								canMinus={false}
							/>
						)}
					</ul>
				</div>
				<div className="footer">
					<div className="weakness_head">
						<span>WEAKNESS TAGS</span>
						<Icon className="add" icon="plus-circle" hide={this.props.isLocked} onClick={this.handleAddWeakness}/>
					</div>
					<ul className="weaknesses">
						{this.props.theme.weaknesses.map((p, i) => 
							<Power
								key={i}
								power={p}
								isLocked={this.props.isLocked}
								onChange={this.props.onChange}
								onDelete={() => this.handleDeleteWeakness(p)}
								canBurn={false}
								canPlus={false}
								canMinus={true}
							/>
						)}
					</ul>
				</div>
			</div>
		);
		/*
        var ret = vnode.attrs.themes.map(t => {
            
			
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