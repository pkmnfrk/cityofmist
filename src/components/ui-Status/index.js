import React from 'react';
import Icon from '../ui-Icon';
import StatusPip from '../ui-StatusPip';

import { editString } from '../../common';

export default class Status extends React.Component {
	constructor(props){
		super(props);
		
		this.handleHeaderClick = this.handleHeaderClick.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
	}
	
    statusClick(i) {
        return (e) => {
            this.props.status.spectrum = i + 1;
            
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
					<StatusPip key={"pip" + x} shaded={this.props.status.spectrum > x} onClick={this.statusClick(x)} />
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
				<StatusPip key={"pip" + x} shaded={this.props.status.spectrum > x} onClick={this.statusClick(x)} label={label} number={i + 1} />
			);
            x += 1;
            
        }
        return ret;
    }
	
	handleHeaderClick() {
		if(!this.props.status.selected) {
			this.props.status.selected = "minus";
		} else if(this.props.status.selected == "minus") {
			this.props.status.selected = "plus";
		} else if(this.props.status.selected == "plus") {
			delete this.props.status.selected;
		}
		this.props.onChange();
	}
	
	handleTagClick() {
		var newTag = editString(this.props.status.name);
		if(newTag != this.props.status.name) {
			this.props.status.name = newTag;
			this.props.onChange();
		}
	}
	
	render() {
		return (<div className="status">
			<Icon icon="times-circle-o" big="true" className="close" onClick={this.props.onDelete} />
			<div className={"header " + (this.props.status.selected || "")} onClick={this.handleHeaderClick}>
				STATUS SPECTRUM CARD
			</div>
			<div className="inner">
				{this.viewSpectrumLabels()}
			</div>
			<div className="tagwrap">
				<div className="taglabel">TAG</div>
				<div className="tag" onClick={this.handleTagClick}>
					{this.props.status.name}
				</div>
			</div>
			<div className="help">
				When you get a status, mark its tier. When you get another on the same spectrum: A greater tier replaces the current; an equal tier increases the current by 1; for a smaller tier, mark a number of boxes equal to its tier right of the current mark and if you hit the next tier up, it replaces the current.
			</div>
		</div>);
		
	}
}