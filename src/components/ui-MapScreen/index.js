import React from 'react';

export default class MapScreen extends React.Component {
	render() {
		return (
			<div id="map">
				<img id="mapimg" src="/api/map" />
			</div>
		);
	}
}