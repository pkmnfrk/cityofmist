import $ from 'jquery';
import React from 'react';
import ReactDom from 'react-dom';
import * as Common from './common';
import Player from './components/ui-Player'

var search = window.location.search;
var room, myPlayer;
if(search[0] == "?") search = search.substring(1);

[room, myPlayer] = search.split('/');

if(room && !myPlayer) {
	myPlayer = room;
	room = "main";
	location = "?" + room + "/" + myPlayer;
}

if(!room) {
	room = prompt("What room are you in?");
    myPlayer = prompt("What is your name?");
    location = "?" + room + "/" + myPlayer;
    
}

//Common.initialize_youtube();

window.root = document.getElementById("root");

ReactDom.render(
	(<Player room={room} player={myPlayer} />),
	root
);
