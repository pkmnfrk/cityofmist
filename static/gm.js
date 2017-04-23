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

function draw() {
    var root = document.getElementById("root");
    m.render(root, m(GMDeck, { chars: allChars, rolls: rolls }));
    
    root.style.gridTemplateColumns = "repeat(" + (characterKeys.length + 1) + ", 1fr)";
    
    initialize_youtube();
}

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