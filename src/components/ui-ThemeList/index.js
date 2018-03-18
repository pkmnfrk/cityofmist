import React from 'react';
import Theme from '../ui-Theme';

export default class ThemeList extends React.Component {
	render() {
		var themes = this.props.themes.map((t,i) => 
			
			<Theme
				key={i}
				theme={t}
				isLocked={this.props.isLocked}
			/>
		);
		
		return <div>
			{themes}
		</div>;
	}
}