import React from 'react';
import ReactDom from 'react-dom';

import GM from './components/ui-GM';

import * as Common from "./common";

import './css/gm.css';

var characterKeys = location.search;

if (characterKeys[0] === "?") {
    characterKeys = characterKeys.substring(1);
}

if(!characterKeys) {
    characterKeys = prompt("Who is in the party? (comma separated, no spaces)");
    location = "?" + characterKeys;
}

characterKeys = characterKeys.split(",");


var root = document.getElementById("root");
ReactDom.render(
	(<GM characterKeys={characterKeys} activeTab="main" />),
	root
);


//root.style.gridTemplateColumns = "repeat(" + (characterKeys.length + 1) + ", 1fr)";

//Common.initialize_youtube();



/*
function sendVideo(id) {
    
    var m = /v=(.*)(?:&.)?/.exec(id);
    
    if(m) {
        id = m[1];
    }
    
    client.publish('/music', {command: "load", id: id});
}

function stopVideo() {
    client.publish('/music', {command: "stop"});
}

function playVideo() {
    client.publish('/music', {command: "play"});
}

function setVolume(vol) {
    client.publish('/music', {command: "vol", vol: vol});
}

function setLoop(loop) {
    client.publish('/music', {command: "loop", loop});
}
*/