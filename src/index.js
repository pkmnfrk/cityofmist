import $ from 'jquery';
import React from 'react';
import ReactDom from 'react-dom';
import * as Common from './common';
import Player from './components/ui-Player'

var myRoom = window.location.search;
if(myRoom[0] == "?") myRoom = myRoom.substring(1);

if(!myRoom) {
    myRoom = prompt("What is your nickname?");
    location = "?" + myRoom;
    
}

function onSwitchTab(tab, title) {
	history.pushState({tab: tab}, title + " - City of Mist", "#" + tab)
	currentTab = tab;
	draw();
}

function handleState(state) {
	if(!state) state = {tab: "main"};
	currentTab = state.tab;
	draw();
}

window.onpopstate = function(e) {
	handleState(e.state);
};

var currentTab = "main";
if(location.hash) {
	currentTab = location.hash.substring(1);
}

Common.initialize_youtube();

window.root = document.getElementById("root");

ReactDom.render(
	(<Player room={myRoom} />),
	root
);
