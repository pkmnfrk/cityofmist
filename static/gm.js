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
    var root = document.body;
    m.render(root, m(GMDeck, { chars: allChars, rolls: rolls }));
    
    root.style.gridTemplateColumns = "repeat(" + (characterKeys.length + 1) + ", 1fr)";
}

loadone(function() {
    
    character_client = client.subscribe('/character/*').withChannel(function (channel, message) {
        
        var id = channel.substring('/character/'.length);
        
        allChars[id] = message;
        
        draw();
    });

    draw();
})