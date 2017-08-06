var Roller = {

    view: function(vnode) {
        var rolls = vnode.attrs.rolls;
        var bonus = 0
		var penalty = 0
		
		if(vnode.attrs.char) {
			for(var theme of vnode.attrs.char.themes) {
				for(var tag of theme.powertags) {
					if(tag.selected == "plus") {
						bonus += 1;
					}
					if(tag.selected == "minus") {
						penalty += 1;
					}
				}
				
				for (var weak of theme.weaknesses) {
					if(weak.selected == "plus") {
						bonus += 1;
					}
					if(weak.selected == "minus") {
						penalty += 1;
					}
				}
			}
			
			for(var status of vnode.attrs.char.statuses) {
				if(status.selected == "plus") {
					bonus += spectrumLevel(status.spectrum);
				}
				if(status.selected == "minus") {
					penalty += spectrumLevel(status.spectrum);
				}
			}
		}
		
        return [
            m("div[class=rollers]", [
                m("button[class=roller]", {onclick: () => { 
					roll("", vnode.attrs.who, vnode.attrs.room, 2, 6, bonus, penalty)
					
					if(vnode.attrs.char) {
						var any = false;
						for(var theme of vnode.attrs.char.themes) {
							for(var tag of theme.powertags) {
								if(tag.selected) {
									any = true;
									delete tag.selected;
								}
							}
							for(var weak of theme.weaknesses) {
								if(weak.selected) {
									any = true;
									delete weak.selected;
								}
							}
						}
						for(var status of vnode.attrs.char.statuses) {
							if(status.selected) {
								delete status.selected;
							}
						}
						
						if(any) {
							save();
						}
					}
					
				}}, "Roll 2d6" + (bonus ? "+" + bonus : "") + (penalty ? "-" + penalty : "")),
                m("ul[id=rolls]", rolls.map((r) => m("li", [
                    "(",
                    new Date(r.when).toLocaleTimeString(),
                    ") ",
                    r.who,
                    ": ",
                    m("span", {class: "total"}, r.total),
                    m("span", {class: "math"}, [
                        r.dice.reduce((a, v) => {
                            if(a.length) {
                                a.push(" + ");
                            }

                            a.push(m("span", {class: "die"}, v));

                            return a;

                        }, []),
                        r.bonus ? [" + ", m("span", {class: "bonus"}, r.bonus)] : [],
                        r.penalty ? [" - ", m("span", {class: "penalty"}, r.penalty)] : [],
                    ]),
                    r.label ? m("span", {class: "label"}, r.label) : ""

                ]))),
                
                isGm() ?
                    m("div[class=music]", [
                        m("input[type=text][id=youtubelink]", { value: "" }),
                        m("button", { onclick: function() {
                            sendVideo(document.getElementById("youtubelink").value);
                        }}, "Send"),
                        m("button", { onclick: function() {
                            
                            setLoop(document.getElementById("shouldloop").checked);
                            playVideo();
                        }}, "Play"),
                        m("button", { onclick: function() {
                            stopVideo();
                        }}, "Stop"),
                        m("button", { onclick: function() {
                            setVolume(5);
                        }}, "Vol: 5%"),
                        m("button", { onclick: function() {
                            setVolume(50);
                        }}, "Vol: 50%"),
                        m("input[type=checkbox][id=shouldloop]", { onchange: function() {
                            setLoop(document.getElementById("shouldloop").checked);
                        }}),
                        m("label[for=shouldloop]", "Should loop")
                        
                    ]) : m("button", { onclick: function() {
                        stopYoutubeVideo();
                    }}, "Stop Music"),
                
                m("div[id=player]")
                
            ])
        ]
        
    }
}
