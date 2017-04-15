

var myRoom = window.location.search;
if(myRoom[0] == "?") myRoom = myRoom.substring(1);

if(!myRoom) {
    myRoom = prompt("What is your nickname?");
    location = "?" + myRoom;
    
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
        who: myRoom,
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
        objs = data;
        
        draw();
    },
    error: function() {
        objs = [
            JSON.parse(JSON.stringify(template)),
            JSON.parse(JSON.stringify(template)),
            JSON.parse(JSON.stringify(template)),
            JSON.parse(JSON.stringify(template))
        ];
        
        draw();
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
    Deck.deck = objs;
    m.render(root, m(Deck));
}
