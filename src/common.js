import Faye from 'faye';
import $ from 'jquery';

export var client = new Faye.Client('/api/faye');

export var rolls = [];

export var save = null;
export var draw = null;

export function setSaveCallback(cb) {
	save = cb;
}
export function setDrawCallback(cb) {
	draw = cb;
}

var _isLocked = false;

export function isLocked() {
	return !document.body.classList.contains("unlocked");
}

export function toggleLocked(l) {
	document.body.classList.toggle("unlocked");
}

var rolls_client = client.subscribe('/rolls/*').withChannel(function(channel, message) {

    rolls.unshift(message);
    while(rolls.length > 15) {
        rolls.pop();
    }
    
    draw();
});

var map_client = client.subscribe("/map", function(message) {
	var map = document.getElementById("mapimg");
	
	if(map) {
		map.src = "";
		//map.src = "/map";
		map.src = "/api/map?" + Math.random();
		
	}
})

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

export function roll(label, who, room, nDice, nSides, bonus, penalty) {
    var dice = [];
    var total = 0;
    
    for(var i = 0; i < nDice; i++) {
        var d = Math.floor(Math.random() * nSides) + 1;
        dice.push(d);
        total += d;
    }
    
    if(bonus) {
        total += bonus;
    }
    if(penalty) {
        total -= penalty;
    }
    
    var message = {
        label: label,
        when: Date.now(),
        who: who,
        dice: dice,
        bonus: bonus,
        penalty: penalty,
        total: total
    };
    
    client.publish('/rolls/' + room, message);
}

function updatePlayer(player) {
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
}

export function getSave(id, cb) {
    $.ajax({
        url: "/api/save/" + id,
        method: "GET",
        success: function(data) {
			updatePlayer(data);
            cb(null, data);
        },
        error: function(err) {
            cb(err);
        }
    });
}

export function putSave(id, objs) {
    $.ajax({
        url: "/api/save/" + id,
        method: "PUT",
        data: JSON.stringify(objs),
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

