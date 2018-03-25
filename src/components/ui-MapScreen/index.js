import React from 'react';
import $ from 'jquery';

import {client} from "../../common";

export default class MapScreen extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			n: this.randomNumber()
		};
		
		this.handlePaste = this.handlePaste.bind(this);
	}
	
	randomNumber() {
		return Math.floor(Math.random() * 100000000);
	}
	
	componentDidMount() {
		if(this.props.isGm) {
			document.addEventListener("paste", this.handlePaste);
		}
		
		this.map_client = client.subscribe("/map/" + this.props.room, (message) => {
			this.setState({
				n: this.randomNumber()
			})
		})
	}
	
	componentWillUnmount() {
		if(this.props.isGm) {
			document.removeEventListener("paste", this.handlePaste);
		}
		
		this.map_client.unsubscribe();
	}
	
	handlePaste(e) {
		if(this.props.hide) return;
	
		console.log("Start paste");
		for(var item of e.clipboardData.items) {
			if(item.kind == "file" && item.type == "image/png") {
				var file = item.getAsFile();
				var reader = new FileReader();
				
				reader.addEventListener("load", () => {
					//console.log(reader.result);
					
					$.ajax({
						url: "/api/map/" + this.props.room,
						data: reader.result,
						contentType: "text/plain",
						method: "PUT",
						
						complete: () => {
						},
						
						error: (e) => {
							console.error(e);
						}
					});
					
				});
				
				if(file) {
					console.log("Reading image...");
					reader.readAsDataURL(file);
				}
			} else {
				console.log(item.kind + " is the wrong kind, or " + item.type + " is not image/png");
			}
		}
		console.log("End paste");
	}
	
	render() {
		var style = {}
		if(this.props.hide) {
			style.display = "none";
		}
		return (
			<div id="map" style={style}>
				<img id="mapimg" src={"/api/map/" + this.props.room + "?n=" + this.state.n} />
			</div>
		);
	}
}