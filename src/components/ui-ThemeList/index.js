import React from 'react';
import Theme from '../ui-Theme';
import { template } from '../ui-Theme';

export default class ThemeList extends React.Component {
	constructor(props) {
		super(props);
		
		this.handleAddTheme = this.handleAddTheme.bind(this);
		this.handleDeleteTheme = this.handleDeleteTheme.bind(this);
	}
	
	handleAddTheme() {
		var newTheme = template();
        
        this.props.themes.push(newTheme);
        this.props.onChange();
	}
	
	handleDeleteTheme(theme) {
		var ix = this.props.themes.indexOf(theme);
		if(ix !== -1) {
			this.props.themes.splice(ix, 1);
			this.props.onChange();
		}
	}
	
	render() {
		var themes = this.props.themes.map((t,i) => 
			
			<Theme
				key={i}
				theme={t}
				isLocked={this.props.isLocked}
				onChange={this.props.onChange}
				onDelete={() => this.handleDeleteTheme(t)}
			/>
		);
		
		while(themes.length < 4) {
            themes.push(
				<button key={"new" + themes.length} onClick={this.handleAddTheme}>Add Theme</button>
			);
        }
		
		return <React.Fragment>
			{themes}
		</React.Fragment>;
	}
}