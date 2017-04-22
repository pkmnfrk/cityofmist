

var myRoom = window.location.search;
if(myRoom[0] == "?") myRoom = myRoom.substring(1);

if(!myRoom) {
    myRoom = prompt("What is your nickname?");
    location = "?" + myRoom;
    
}

document.onkeypress = function(e) {
    e = e || window.event;
    
    if(e.key == "l") {
        toggleLocked();
    }
}

function toggleLocked() {
    document.body.classList.toggle("unlocked");
}

function isLocked() {
    return !document.body.classList.contains("unlocked");
}

var client = new Faye.Client('/faye');
var character = client.subscribe('/character/' + myRoom, function(message) {
    objs = message;
    draw();
});

var rolls = client.subscribe('/rolls/*').withChannel(function(channel, message) {

    Roller.rolls.unshift(message);
    while(Roller.rolls.length > 15) {
        Roller.rolls.pop();
    }
    
    draw();
});

function firstName(name) {
    var parts = name.split(" ", 2);
    return parts[0];
}

function roll(label, nDice, nSides, bonus, penalty) {
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
        who: firstName(objs.name),
        dice: dice,
        bonus: bonus,
        penalty: penalty,
        total: total
    };
    
    client.publish('/rolls/' + myRoom, message);
}

var template = {
    type: "logos",
    book: "<type>",
    name: "<name>",
    attention: [false, false, false],
    fade: [false, false, false],
    mystery: "<identity/mystery here>",
    description: "<description here>",
    powertags: [
        {
            name: "<first power tag>",
            burned: false
        },
        {
            name: "<second power tag>",
            burned: false
        },
        {
            name: "<third power tag>",
            burned: false
        }
    ],

    weaknesses: [
        {
            name: "<weakness tag>"
        }
    ]
}
var objs = null;

$.ajax({
    url: "/save/" + myRoom,
    method: "GET",
    success: function(data) {
        //alert(data);
        
        if(Array.isArray(data)) {
            data = {
                themes: data
            };
        }
        
        objs = data;
        
        if(!objs.statuses) {
            objs.statuses = [];
        }
        
        if(!objs.name) {
            objs.name = "<character name>";
        }
        
        draw();
    },
    error: function() {
        objs = {
            name: "<character name>",
            themes: [
                JSON.parse(JSON.stringify(template)),
                JSON.parse(JSON.stringify(template)),
                JSON.parse(JSON.stringify(template)),
                JSON.parse(JSON.stringify(template))
            ],
            statuses: []
        };
        
        objs.themes[0].type = "mythos";
        
        save();
    }
})


function save() {
    draw();
    
    $.ajax({
        url: "/save/" + myRoom,
        method: "PUT",
        data: JSON.stringify(objs),
        contentType: "application/json",
        success: function() {
            
        }
    });
}

function draw() {
    var root = document.body;
    m.render(root, m(Deck, {char:objs}));
}
