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

export function roll(label, who, room, nDice, nSides, bonus, penalty, advantage) {
    var dice = [];
	var dropped = [];
    var total = 0;
	
    var lowest = -1;
	var highest = -1;
	
	if(advantage) {
		nDice += 1;
	}
    
	for(var i = 0; i < nDice; i++) {
        var d = Math.floor(Math.random() * nSides) + 1;
        dice.push(d);
		
		if(lowest == -1 || (lowest !== -1 && d < dice[lowest])) {
			lowest = i;
		}
		if(highest == -1 || (highest !== -1 && d > dice[highest])) {
			highest = i;
		}
    }
	
	console.log("Lowest: " + lowest);
	console.log("Highest: " + highest);
	
	if(advantage == "advantage") {
		dropped.push(lowest);
	} else if(advantage == "disadvantage") {
		dropped.push(highest);
	}
	
	for(var i = 0; i < dice.length; i++) {
		if(dropped.indexOf(i) === -1) {
			total += dice[i];
		}
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
        total: total,
		advantage: advantage,
		dropped: dropped
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
	
	for(var i = 0; i < player.themes.length; i++) {
		if(Array.isArray(player.themes[i].attention)) {
			player.themes[i].attention = player.themes[i].attention.reduce((a,v) => a + (v?1:0),0);
		}
		if(Array.isArray(player.themes[i].fade)) {
			player.themes[i].fade = player.themes[i].fade.reduce((a,v) => a + (v?1:0),0);
		}
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

