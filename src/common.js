import Faye from 'faye';
import $ from 'jquery';

export var client = new Faye.Client('/api/faye');


var music_client = client.subscribe("/music", function(message) {
    switch(message.command) {
        case "play":
            youtube_player.playVideo();
            break;
        case "stop":
            youtube_player.pauseVideo();
            break;
        case "load":
            /*youtube_player.loadVideoById({
                videoId: message.id
            });*/
            youtube_player.loadPlaylist({
                playlist: message.id
            })
            youtube_player.setLoop(true);
            break;
        case "vol":
            youtube_player.setVolume(message.vol);
            break;
        case "loop":
            youtube_player.setLoop(message.loop);
            break;
    }
});

export function firstName(name) {
    var parts = name.split(" ", 2);
    return parts[0];
}

export function randomRange(min, max) {
	if(typeof min == "undefined") {
		min = 0;
	}
	if(typeof max == "undefined") {
		max = 100;
	}
	var rng = max - min;
	
	return Math.floor(Math.random() * rng) + min;
}

export function randomId() {
	return randomRange(1, 1000000000);
}

export function createTag(type) {
	return {
		spectrum: 1,
		type: type,
		id: randomId()
	}
}

function updatePlayer(player, id) {
	if(!player.id) {
		player.id = id;
	}
	
	if(Array.isArray(player)) {
		player = {
			themes: player
		};
	}
		
	if(!player.moves) {
		player.moves = [];
	}
	
	if(!player.statuses) {
		player.statuses = [];
	}
	
	if(!player.name) {
		player.name = "<character name>";
	}
	
	for(var i = 0; i < player.themes.length; i++) {
		if(Array.isArray(player.themes[i].attention)) {
			player.themes[i].attention = player.themes[i].attention.reduce((a,v) => a + (v?1:0),0);
		}
		if(Array.isArray(player.themes[i].fade)) {
			player.themes[i].fade = player.themes[i].fade.reduce((a,v) => a + (v?1:0),0);
		}
	}
	
	for(var i = 0; i < player.statuses.length; i++) {
		if(!player.statuses[i].type) {
			player.statuses[i].type = "status";
		}
		if(!player.statuses[i].id) {
			player.statuses[i].id = randomId();
		}
		
	}
}

export function getSave(room, id, cb) {
    $.ajax({
        url: "/api/save/" + room + "/" + id,
        method: "GET",
        success: function(data) {
			updatePlayer(data, id);
            cb(null, data);
        },
        error: function(err) {
            cb(err);
        }
    });
}

export function putSave(room, id, objs) {
    $.ajax({
        url: "/api/save/" + room + "/" + id,
        method: "PUT",
        data: JSON.stringify(objs),
        contentType: "application/json",
        success: function() {
            
        }
    });
}

export function sendRoll(room, roll) {
    $.ajax({
        url: "/api/roll/" + room,
        method: "POST",
        data: JSON.stringify(roll),
        contentType: "application/json",
        success: function() {
            
        }
    });
}

export function getRoom(room, cb) {
    $.ajax({
        url: "/api/room/" + room,
        method: "GET",
        success: function(data) {
            cb(null, data);
        },
        error: function(err) {
            cb(err);
        }
    });
}

export function joinRoom(room, id) {
	$.ajax({
        url: "/api/room/join/" + room,
        method: "POST",
        data: JSON.stringify({ id: id }),
        contentType: "application/json",
        success: function() {
            
        }
    });
}

export function partRoom(room, id) {
	$.ajax({
        url: "/api/room/part/" + room,
		async: false,
        method: "POST",
        data: JSON.stringify({ id: id }),
        contentType: "application/json",
        success: function() {
            
        }
    });
}

export function isGm() {
    return document.body.classList.contains("gm");
}

export function spectrumLevel(s) {
	if(s <= 1) return 1;
	if(s <= 3) return 2;
	if(s <= 6) return 3;
	if(s <= 10) return 4;
	if(s <= 15) return 5;
	return 6;
}

export function addMajorSpectrumLevel(orig, add)
{
	var level = spectrumLevel(orig);
	
	level += add;
	
	if(level <= 1) return 1;
	if(level == 2) return 2;
	if(level == 3) return 4;
	if(level == 4) return 7;
	if(level == 5) return 11;
	return 16;
}

export function editString(t) {
    var n = prompt("Edit", t);
    if(!n) return t;
    return n;
}

var youtube_player = null;

/* YOUTUBE EMBED API */

export function initialize_youtube() {
    if(youtube_player) return;
    
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.

window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
    youtube_player = new YT.Player('player', {
        height: '180',
        width: '320',
        //videoId: 'RdYsLC0GELo',
        //videoId: 'Z6UjLGP549M',
        /*playerVars: {
            loop: true,
            
        },*/
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
window.onPlayerReady = function onPlayerReady(event) {
    //event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var youtube_done = false;
window.onPlayerStateChange = function onPlayerStateChange(event) {
    //if (event.data == YT.PlayerState.PLAYING) {
        //setTimeout(stopVideo, 6000);
//        youtube_done = false;
    //}
}


export function stopYoutubeVideo() {
    youtube_player.stopVideo();
}
/* END YOUTUBE EMBED API */

