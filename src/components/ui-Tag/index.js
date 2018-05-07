import React from 'react';
import Icon from '../ui-Icon';
import StatusPip from '../ui-StatusPip';

import * as Common from '../../common';

import './index.css';

export default class Status extends React.Component {
	constructor(props){
		super(props);
		
		this.handleHeaderClick = this.handleHeaderClick.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
	}
	
    statusClick(i) {
        return (e) => {
            this.props.tag.spectrum = i + 1;
            
            this.props.onChange();
        };
    }

    viewSpectrumLabels() {
        var pips = [0, 0, 1, 2, 3, 4];
        
        var ret = [];
        var x = 0;
        for(var i = 0; i < 6; i++) {
            var col = [];
            
            for(var j = 0; j < pips[i]; j++) {
				ret.push(
					<StatusPip key={"pip" + x} shaded={this.props.tag.spectrum > x} onClick={this.statusClick(x)} />
				);
				
                x += 1;
            }
            
			var label = "";
			
            if(i == 4) {
				label = "OUT";
            } else if(i == 5) {
				label = "MC";
            }
			
			ret.push(
				<StatusPip key={"pip" + x} shaded={this.props.tag.spectrum > x} onClick={this.statusClick(x)} label={label} number={i + 1} />
			);
            x += 1;
            
        }
        return ret;
    }
	
	handleHeaderClick() {
		if(this.props.tag.type == "clue" || this.props.tag.type == "juice") return;
		
		if(!this.props.tag.selected) {
			this.props.tag.selected = "minus";
		} else if(this.props.tag.selected == "minus") {
			this.props.tag.selected = "plus";
		} else if(this.props.tag.selected == "plus") {
			delete this.props.tag.selected;
		}
		this.props.onChange();
	}
	
	handleStatusClick(id) {
		for(var i = 0; i < this.props.tag.statuses.length; i++) {
			var stat = this.props.tag.statuses[i];
			
			if(stat.id === id) {
				
				if(!stat.selected) {
					stat.selected = "minus";
				} else if(stat.selected == "minus") {
					stat.selected = "plus";
				} else if(stat.selected == "plus") {
					delete stat.selected;
				}
				this.props.onChange();
			}
		}
	}
	
	handleTagClick() {
		var newTag = Common.editString(this.props.tag.name);
		if(newTag != this.props.tag.name) {
			this.props.tag.name = newTag;
			this.props.onChange();
		}
	}
	
	handleStatusEdit(e, id) {
		e.stopPropagation()
		for(var i = 0; i < this.props.tag.statuses.length; i++) {
			if(this.props.tag.statuses[i].id === id) {
				var newTag = Common.editString(this.props.tag.statuses[i].name);
				if(newTag != this.props.tag.statuses[i].name) {
					this.props.tag.statuses[i].name = newTag;
					this.props.tag.statuses.sort(this.sortStatuses);
					this.props.onChange();
				}
			}
		}
	}
	
	handleTypeClick(e, type) {
		e.stopPropagation();
		if(type !== this.props.tag.type) {
			this.props.tag.type = type;
			this.props.onChange();
		}
	}
	
	handleAddStatus() {
		var status = Common.createTag("status");
		status.name = "Status";
		
		if(!this.props.tag.statuses) {
			this.props.tag.statuses = [];
		}
		this.props.tag.statuses.push(status);
		this.props.tag.statuses.sort(this.sortStatuses);
		this.props.onChange();
	}
	
	handleAddTag() {
		var status = Common.createTag("tag");
		status.name = "Tag";
		
		if(!this.props.tag.statuses) {
			this.props.tag.statuses = [];
		}
		this.props.tag.statuses.push(status);
		this.props.tag.statuses.sort(this.sortStatuses);
		this.props.onChange();
	}
	
	handleDeleteStatus(id) {
		for(var i = 0; i < this.props.tag.statuses.length; i++) {
			if(this.props.tag.statuses[i].id === id) {
				this.props.tag.statuses.splice(i, 1);
				this.props.tag.statuses.sort(this.sortStatuses);
				this.props.onChange();
				return;
			}
		}
	}
	
	handleModifyStatus(e, id, amt) {
		e.stopPropagation();
		e.preventDefault();
		for(var i = 0; i < this.props.tag.statuses.length; i++) {
			if(this.props.tag.statuses[i].id === id) {
				var newSpec = Common.addMajorSpectrumLevel(this.props.tag.statuses[i].spectrum, amt);
				if(newSpec != this.props.tag.statuses[i].spectrum) {
					this.props.tag.statuses[i].spectrum = newSpec;
					this.props.onChange();
				}
				return;
			}
		}
	}
	
	sortStatuses(a, b) {
		if(a.type == "tag" && b.type == "status") return -1;
		if(a.type == "status" && b.type == "tag") return 1;
		if(a.name < b.name) return -1;
		if(a.name > b.name) return 1;
		return a.id - b.id;
	}
	
	renderSpectrum() {
		return (<div className="inner">
				{this.viewSpectrumLabels()}
			</div>);
	}
	
	renderStatuses() {
		var statuses = null;
		
		if(this.props.tag.statuses && this.props.tag.statuses.length) {
			statuses = this.props.tag.statuses.map((s) => {
				var spec = null;
				if(s.type == "status") {
					spec = (<React.Fragment>
						&nbsp;-&nbsp;
						{Common.spectrumLevel(s.spectrum)}
							{" "}
						<Icon outline={false} icon="minus-circle" className="minusstatus" onClick={(e) => this.handleModifyStatus(e, s.id, -1)} />
						<Icon outline={false} icon="plus-circle" className="plusstatus"   onClick={(e) => this.handleModifyStatus(e, s.id, 1)} />
					</React.Fragment>);
				}
				
				return (<li key={s.id} className={s.selected} onClick={() => this.handleStatusClick(s.id)}>
					<Icon outline={false} icon="times-circle" className="delete" onClick={() => this.handleDeleteStatus(s.id)} />
					{s.name}
					<Icon outline={true} icon="edit" className="edit" onClick={(e) => this.handleStatusEdit(e, s.id)} />
					{spec}
				</li>);
			});
		}
		
		//if(statuses) {
			statuses = <ul className="substatuses">{statuses}</ul>
		//}
		
		return (
			<React.Fragment>
				{statuses}
				<div className="addtags">
					<button onClick={() => this.handleAddStatus()}> Add Status</button>
					<button onClick={() => this.handleAddTag()}> Add Tag</button>
				</div>
			</React.Fragment>
		);
	}
	
	renderHelp() {
		if(this.props.tag.type === "clue")
		{
			return (<div className="help">
				Mark a number of boxes representing banked clues, and a description of where and how you got them. Eg, "Questioning John Doe"
			</div>);
		}
		else if(this.props.tag.type === "juice")
		{
			return (<div className="help">
				Mark a number of boxes representing banked juice, and a description of how you got it. Eg, "Healing Powers"
			</div>);
		}
		else if(this.props.tag.type == "tag")
		{
			return this.renderStatuses();
		}
		else if(this.props.tag.type == "status")
		{
			return (<div className="help">
				When you get a status, mark its tier. When you get another on the same spectrum: A greater tier replaces the current; an equal tier increases the current by 1; for a smaller tier, mark a number of boxes equal to its tier right of the current mark and if you hit the next tier up, it replaces the current.
			</div>);
		}
	}
	
	sizeForTagName() {
		var l = 0;
		if(this.props.tag && this.props.tag.name) {
			l = this.props.tag.name.length;
		}
		if(l < 15) {
			return "";
		}
		
		if(l < 25) {
			return "small";
		}
		
		return "smallest";
	}
	
	renderHeader()
	{
		var title = "TRACKING CARD";
		
		switch(this.props.tag.type) {
			case "clue": title = "CLUE " + title; break;
			case "juice": title = "JUICE " + title; break;
			case "tag": title = "TAG " + title; break;
			case "status": title = "STATUS " + title; break;
			default: title = "UNKNOWN " + title; break;
		}
		
		return (
		<div className={"header " + (this.props.tag.selected || "")} onClick={this.handleHeaderClick}>
			{title}
			<div className="icons">
				<Icon className={"icon " + (this.props.tag.type == "clue" ? "active" : "")}   onClick={(e)=> this.handleTypeClick(e, "clue")} fixedWidth={true} icon="search" />
				<Icon className={"icon " + (this.props.tag.type == "juice" ? "active" : "")}  onClick={(e)=> this.handleTypeClick(e, "juice")} fixedWidth={true} icon="wine-glass" />
				<Icon className={"icon " + (this.props.tag.type == "tag" ? "active" : "")}    onClick={(e)=> this.handleTypeClick(e, "tag")} fixedWidth={true} icon="tag" />
				<Icon className={"icon " + (this.props.tag.type == "status" ? "active" : "")} onClick={(e)=> this.handleTypeClick(e, "status")} fixedWidth={true} icon="medkit" />
			</div>
		</div>);
	}
	
	render() {
		return (<div className="status">
			<Icon outline="true" icon="times-circle" big="true" className="close" onClick={this.props.onDelete} />
				{this.renderHeader()}
			{ (this.props.tag.type != "tag") ? this.renderSpectrum() : null}
			<div className="tagwrap">
				<div className="taglabel">TAG</div>
				<div className={"tag " + this.sizeForTagName()} onClick={this.handleTagClick}>
					{this.props.tag.name}
				</div>
			</div>
			{this.renderHelp()}
		</div>);
		
	}
}

Status.defaultProps = {
}