import React from 'react';
import Icon from '../ui-Icon';
import StatusPip from '../ui-StatusPip';

import { editString } from '../../common';

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
		if(!this.props.tag.selected) {
			this.props.tag.selected = "minus";
		} else if(this.props.tag.selected == "minus") {
			this.props.tag.selected = "plus";
		} else if(this.props.tag.selected == "plus") {
			delete this.props.tag.selected;
		}
		this.props.onChange();
	}
	
	handleTagClick() {
		var newTag = editString(this.props.tag.name);
		if(newTag != this.props.tag.name) {
			this.props.tag.name = newTag;
			this.props.onChange();
		}
	}
	
	handleTypeClick(e, type) {
		e.stopPropagation();
		if(type !== this.props.tag.type) {
			this.props.tag.type = type;
			this.props.onChange();
		}
	}
	
	renderSpectrum() {
		return (<div className="inner">
				{this.viewSpectrumLabels()}
			</div>);
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
			return null;
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
	
	render() {
		return (<div className="status">
			<Icon outline="true" icon="times-circle" big="true" className="close" onClick={this.props.onDelete} />
			<div className={"header " + (this.props.tag.selected || "")} onClick={this.handleHeaderClick}>
				Tracking CARD
				<div className="icons">
					<Icon className={"icon " + (this.props.tag.type == "clue" ? "active" : "")}   onClick={(e)=> this.handleTypeClick(e, "clue")} fixedWidth={true} icon="search" />
					<Icon className={"icon " + (this.props.tag.type == "juice" ? "active" : "")}  onClick={(e)=> this.handleTypeClick(e, "juice")} fixedWidth={true} icon="wine-glass" />
					<Icon className={"icon " + (this.props.tag.type == "tag" ? "active" : "")}    onClick={(e)=> this.handleTypeClick(e, "tag")} fixedWidth={true} icon="tag" />
					<Icon className={"icon " + (this.props.tag.type == "status" ? "active" : "")} onClick={(e)=> this.handleTypeClick(e, "status")} fixedWidth={true} icon="medkit" />
				</div>
			</div>
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