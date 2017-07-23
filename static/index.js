var myRoom = window.location.search;
if(myRoom[0] == "?") myRoom = myRoom.substring(1);

if(!myRoom) {
    myRoom = prompt("What is your nickname?");
    location = "?" + myRoom;
    
}

var character = client.subscribe('/character/' + myRoom, function(message) {
    objs = message;
    draw();
});

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

function onSwitchTab(tab, title) {
	history.pushState({tab: tab}, title + " - City of Mist", "#" + tab)
}

function handleState(state) {
	if(!state) state = {tab: "main"};
	TabSwitcher.active = state.tab;
	draw();
}

window.onpopstate = function(e) {
	handleState(e.state);
};

var currentTab = "main";
if(location.hash) {
	currentTab = location.hash.substring(1);
}

function draw() {
    var root = document.getElementById("root");
    m.render(root, m(Deck, { char:objs, rolls: rolls, activetab: currentTab, onswitch: onSwitchTab}));
    document.title = TabSwitcher.title + " - City of Mist";
    initialize_youtube();
}