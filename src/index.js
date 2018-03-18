import $ from 'jquery';
import m from 'mithril';
import * as Common from './common';
import Deck from './Deck'
import TabSwitcher from './TabSwitcher';

import './css/index.css';

var myRoom = window.location.search;
if(myRoom[0] == "?") myRoom = myRoom.substring(1);

if(!myRoom) {
    myRoom = prompt("What is your nickname?");
    location = "?" + myRoom;
    
}

var character = Common.client.subscribe('/character/' + myRoom, function(message) {
    objs = message;
    draw();
});

document.onkeypress = function(e) {
    e = e || window.event;
    
    if(e.key == "l") {
        Common.toggleLocked();
    }
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

/*$.ajax({
    url: "/save/" + myRoom,
    method: "GET",
    success: function(data) {
        //alert(data);
        
        objs = data;
        
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
})*/


Common.getSave(myRoom, function(err, data) {
	if(err) {
		data = {
            name: "<character name>",
            themes: [
                JSON.parse(JSON.stringify(template)),
                JSON.parse(JSON.stringify(template)),
                JSON.parse(JSON.stringify(template)),
                JSON.parse(JSON.stringify(template))
            ],
            statuses: []
        };
		data.themes[0].type = "mythos";
	}
	
	objs = data;
	
	save();
});



function save() {
    draw();
   
	Common.putSave(myRoom, objs);
}

Common.setSaveCallback(save);

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
    m.render(root, m(Deck, { char:objs, activetab: currentTab, onswitch: onSwitchTab, room: myRoom}));
    document.title = TabSwitcher.title + " - City of Mist";
}

Common.initialize_youtube();
Common.setDrawCallback(draw);

window.root = document.getElementById("root");