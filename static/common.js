
var client = new Faye.Client('/faye');

var rolls = [];

var rolls_client = client.subscribe('/rolls/*').withChannel(function(channel, message) {

    rolls.unshift(message);
    while(rolls.length > 15) {
        rolls.pop();
    }
    
    draw();
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

function getSave(id, cb) {
    $.ajax({
        url: "/save/" + id,
        method: "GET",
        success: function(data) {            
            cb(null, data);
        },
        error: function(err) {
            cb(err);
        }
    });
}
