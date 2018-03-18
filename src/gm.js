import m from 'mithril';
import $ from 'jquery';

import GMDeck from './GMDeck';
import TabSwitcher from './TabSwitcher';

import { getSave, client } from "./common";
import * as Common from "./common";

import './css/gm.css';

var characterKeys = location.search;
var allChars = {};
var character_client = null;

if (characterKeys[0] === "?") {
    characterKeys = characterKeys.substring(1);
}

if(!characterKeys) {
    characterKeys = prompt("Who is in the party? (comma separated, no spaces)");
    location = "?" + characterKeys;
}

characterKeys = characterKeys.split(",");
var loadindex = 0;

function loadone(done) {
    if(loadindex >= characterKeys.length) {
        return done();
    }
    
    getSave(characterKeys[loadindex], function(err, char) {
        allChars[characterKeys[loadindex]] = char;
        
        loadindex += 1;
        return loadone(done);
    });
}


function onpaste(e) {
	if(TabSwitcher.active != "map") return;
	
	console.log("Start paste");
	for(var item of e.clipboardData.items) {
		if(item.kind == "file" && item.type == "image/png") {
			var file = item.getAsFile();
			var reader = new FileReader();
			
			reader.addEventListener("load", function() {
				//console.log(reader.result);
				
				$.ajax({
					url: "/api/map",
					data: reader.result,
					contentType: "text/plain",
					method: "PUT",
					
					complete: function() {}
				});
				
			});
			
			if(file) {
				console.log("Reading image...");
				reader.readAsDataURL(file);
			}
		}
	}
	console.log("End paste");
};

document.addEventListener("paste", onpaste);

function draw() {
    var root = document.getElementById("root");
    m.render(root, m(GMDeck, { chars: allChars, activetab: "main" }));
    
    //root.style.gridTemplateColumns = "repeat(" + (characterKeys.length + 1) + ", 1fr)";
    
    Common.initialize_youtube();
}

Common.setDrawCallback(draw);



loadone(function() {
    
    character_client = client.subscribe('/character/*').withChannel(function (channel, message) {
        
        var id = channel.substring('/character/'.length);
        
        allChars[id] = message;
        
        draw();
    });

    draw();
})

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