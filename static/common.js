
var client = new Faye.Client('/faye');

var rolls = [];
var global_moves = [
	{
		name: "Regular moves",
		moves: [
			{
				name: "Investigate",
				text: "<p>When you use your abilities to <strong>seek answers to burning questions</strong>, roll +power. On a hit, you uncover as many Clues as your Power. Spend Clues 1-to-1 to ask the MC a question about the subject of your investigation or ask another player a relevant question about their character. They must give you either a straight answer or a solid lead. On a 7-9, they can also choose 1:</p> <ul><li>Your investigation exposes you to danger.</li><li>The Clues you get are fuzzy, incomplete or part-true part-false.</li><li>Whoever or whatever you are asking the question(s) can ask you one question as well. You answer on the same terms.</li></ul><p>Sample questions:</p><ul><li>What here is useful to me?</li><li>What happened here recently?</li><li>Where can I find &lt;person/thing&gt;?</li><li>What is the best way out/in/through/around?</ul>",
				examples: [
					"Search using your senses",
					"Ask questions in a conversation",
					"Inspect an object or a scene",
					"Look up or decypher information",
					"Make calls to contacts",
					"Evaluate a person or situation"
				]
			},
			{
				name: "Sneak Around",
				text: "<p>When you use your abilities <strong>to do something secretly or deceptively</strong>, roll +power. On a 10+, everyone that should fall for it falls for it. On a 7-9, the MC chooses one:</p> <ul><li>Someone unimportant noticed you, but that just made them important, right?</li><li>You are percieved only in a secondary sense (someone picks up your scent while you're sneaking; you're seen whispering a message, but the message is not heard).</li><li>You're stuck in an uneasy and stressful position in the middle of your action. To finish it secretly or get out of there without being seen, you must <strong>Take the Risk</strong> or <strong>Face Danger</strong>, MC's call.<li></ul>",
				examples: [
					"Lie or deceive",
					"Impersonate",
					"Pick pocket",
					"Move undetected",
					"Eavesdrop"
				]
			},
			{
				name: "Go Toe-to-Toe",
				text: "<p>When you use your abilities to <strong>overcome someone or something in a struggle for control</strong>, state what your goal is. Your opponent can describe how they respond, at their option. Roll +power. On a 7-9, choose 1, on a 10+, choose 2:</p> <ul><li>You manage to reach your goal, e.g., take something they hold</li><li>You get them good, inflicting a status with tier=power</li><li>You block, dodge or counter their best attempts. If you don't choose this, they can inflict a status on you. If they are a PC, its tier=their power (based on relevant tags and statuses, as usual)</li></ul>",
				examples: [
					"Engage in martial-arts or close-quarters combat",
					"Fight someone for control of a position or object",
					"Outshine others at a social gathering",
					"Try to outrun pursuers",
					"Gain the upper hand in a game",
					"Engage in a battle of wits"
				]
			},
			{
				name: "Convince",
				text: "<p>When you use your abilities <strong>to talk, threaten or seduce</strong> someone into doing something, roll +power. On a hit, they choose either to take a relevant status of your choice with tier=power or:</p> <ul><li>On a 7-9, to give in a little, but protect their own agenda</li><li>On a 10+, to update their agenda to include yours, at least for the time being.</li></ul>",
				examples: [
					"Bribe an official",
					"Close a deal",
					"Flirt to get what you want",
					"Threaten with violence or a promise of future suffering",
					"Blackmail someone"
				]
			},
			{
				name: "Face Danger",
				text: "<p>When you use your abilities <strong>to avoid an incoming hit, endure harm, resist a malign influence or hold it together</strong>, the MC will name a status with its tag and tier. Roll +power. On a 10+, you fend off the effect and take no status at all. On a 7-9, you take the status, but with -1 tier. On a miss, you take the full status.</p>",
				examples: [
					"Take a hit",
					"Dodge a hit",
					"Block a hit",
					"Withstand harsh conditions",
					"Project a protective barrier",
					"Fend off enemies",
					"Endure the effect of a toxin or disease",
					"Overcome fear"
				]
			},
			{
				name: "Take the Risk",
				text: "<p>When you use your abilities <strong>to perform a daring, risky, dangerous or outright stupid feat</strong>, roll +power. On a 10+, you do it, somehow. On a 7-9, things get messy. The MC will offer you a hard bargin or ugly choice.</p>",
				examples: [
					"Climb a slippery ledge",
					"Defuse a bomb",
					"Drive through a marketplace",
					"Cross a security laser grid",
					"Slide under a closing gate",
					"Step up to an armed gang of mobsters and start talking"
				]
			},
			{
				name: "Change the Game",
				text: "<p>When you use your abilities <strong>to give you or your allies an advantage</strong>, roll +power. On a hit, you get Juice=power. Spend your Juice, 1 for 1, to gain the following effects, but they must be related to the tags you used:</p> <ul><li>Inflict a status with tier-1 (can be chosen multiple times, the tier increases by 1 each time)</li><li>Create/summon new objects or beings with 1 tag of your choice</li><li>Add a new temporary tag to one character, object or location</li><li>Remove 1-tier from a status</li><li>Scratch out a player's power tag (as if it was burnt)</li></ul> <p>By default, your effect is topical (affects one target), temporary (only affects the next relevant action), and discernable. On a 10+, you get a minimum of Juice-2, and you can also use your Juice to choose:</p> <ul><li>Scale up the effect (greater area or more targets)</li><li>Prolong the effect (make the statuses and tags you create ongoing)</li><li>Hide the effect</li><li>Any other improvement you and the MC agree on.</li></ul>",
				examples: [
					"Heal, restore or fix",
					"Get out of a tough spot",
					"Gain or give a tactical advantage",
					"Set up a defense",
					"Create or acquire a useful object",
					"Weaken the opposition"
				]
			},
			{
				name: "Hit With All You've Got",
				text: "<p>When you have a <strong>clear shot</strong> and you use your abilities to <strong>hit someone or something with all you've got</strong>, roll +power. On a hit, you hit, inflicting a status upon your target with tier=power and a tag relevant to the abilities you used. On a 7-9, choose 1, on a 10+ choose 2:</p> <ul><li>You take cover or secure a superior position so that they can't hit you back.</li><li>You get them good or get many of them (+1 tier)</li><li>There's no collateral damage, or there's loads of collateral damage.</li><li>You hold the target's attention, if possible</li></ul><p>On a 10+, you can also choose from the following options:</p><ul><li>If it's in your ability to move them, they are out of the way.</li><li>You gain an advantage on the battlefield. You get 1 Juice (see <strong>Change the Game</strong> move).</li></ul>",
				examples: [
					"Throw a punch at someone",
					"Throw a car at someone",
					"Fire at someone",
					"Use a supernatural ability on someone at full power",
					"Spray-fire into an area"
				]
			}
		]
	},
	{
		name: "Downtime moves",
		moves: [
			{
				name: "Photomontage [Downtime]",
				text: "<p>Whenever you have some downtime, choose one way to spend it:</p><ul><li><strong>Give attention to one of your Logos themes.</strong> Tell everone at the table how you do it and mark Attention on that theme.</li><li><strong>Investigate a case.</strong> Tell everyone at the table how you do it. You gain three Clues to use as in the <strong>Investigate</strong> move, bsed on your investigation.</li><li><strong>Explore your Mythos.</strong> Tell everyone at the table which Mystery you explore and how you do it. You gain one Clue to use as in the <strong>Investigate</strong> move, based on your investigation. Mark Attention on that Mystery's theme.</li><li><strong>Prepare for your next activity.</strong> Tell everyone how you prepare and choose one: recover all your burnt tags OR gain 3 Juice to use as in <strong>Change the Game</strong> move (you can choose from all the options).</li><li><strong>Recover from the last activity.</strong> For each ongoing status still afflicting you, the MC will tell you if and how it can be removed during your downtime. The MC can also rule that you partially recover from a status or allow you to reduce it by 1 tier for each relevant tag you have.</li></ul><p>The MC can cue into any of the photomontage events and continue them as scenes.</p>"
			}
		]
	},
	{
		name: "Mythos/Identity moves",
		moves: [
			{
				name: "Look Beyond the Mist",
				text: "<p>When you <strong>reach inside to get in touch with your Mythos</strong>, you can feel the truth behind things without even knowing how. Play it out like the <strong>Investigate</strong> move, but roll+mythos instead. On a hit, you get Clues=mythos."
			},
			{
				name: "Stop. Holding. Back.",
				text: "<p>When you <strong>use your abilities in a way or scale you've never attempted before</strong>, the MC will choose one stake and write it on a piece of paper, out of sight:</p> <ul><li><strong>You're resisting.</strong><br/>What you are trying to do comes into conflict with your Identity/Mystery _______. Mark Crack/Fade on its theme.</li><li><strong>It will burn you out.</strong><br/>If you do it, mark the burn icon next to all the tags in the theme _______. They're burnt.</li><li><strong>It will leave a mark.</strong><br/>If you do it, take a status _____. You cannot avoid it with <strong>Face Danger</strong>.</li><li><strong>It will change you forever.</strong><br/>If you do it, you will lose your theme _______.</li></ul> <p>Then, roll +logos. On a 7-9, you do it and pay the price. On a 10+, you can take a look at the stakes the MC wrote and then choose&mdash;do it and pay the price or hold back. On a miss, you lose control over your powers&mdash;the MC will say how.</p>"
			},
			{
				name: "Make a Hard Choice",
				text: "<p>When you <strong>act against one of your Identities or Mysteries</strong>, mark Crack/Fade on its theme. If you acted for the sake of one of your other Identities or Mysteries, mark Attention on its theme.</p>"
			}
		]
	}
];


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
		map.src = "/map?" + Math.random();
		
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

function firstName(name) {
    var parts = name.split(" ", 2);
    return parts[0];
}

function roll(label, who, room, nDice, nSides, bonus, penalty) {
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
	if(!player.moves) {
		player.moves = [];
	}
	
}

function getSave(id, cb) {
    $.ajax({
        url: "/save/" + id,
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

function isGm() {
    return document.body.classList.contains("gm");
}

function spectrumLevel(s) {
	if(s <= 1) return 1;
	if(s <= 3) return 2;
	if(s <= 6) return 3;
	if(s <= 10) return 4;
	if(s <= 15) return 5;
	return 6;
}

function editString(t) {
    var n = prompt("Edit", t);
    if(!n) return t;
    return n;
}

var youtube_player = null;

/* YOUTUBE EMBED API */

function initialize_youtube() {
    if(youtube_player) return;
    
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.

function onYouTubeIframeAPIReady() {
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
function onPlayerReady(event) {
    //event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var youtube_done = false;
function onPlayerStateChange(event) {
    //if (event.data == YT.PlayerState.PLAYING) {
        //setTimeout(stopVideo, 6000);
//        youtube_done = false;
    //}
}


function stopYoutubeVideo() {
    youtube_player.stopVideo();
}
/* END YOUTUBE EMBED API */

