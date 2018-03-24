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

//Common.initialize_youtube();

window.root = document.getElementById("root");

ReactDom.render(
	(<Player room={myRoom} />),
	root
);
