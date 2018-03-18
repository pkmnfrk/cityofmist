import m from 'mithril';
import { save, editString } from './common';

export default {
    statusCheck: function(status, i) {
        return (e) => {
            status.spectrum = i + 1;
            
            save();
        };
    },
    
    viewCheckbox: function(status, i) {
        return m("div", {class: status.spectrum > i ? "shaded" : "", onclick: this.statusCheck(status, i)})
    },
    
    viewCheckboxes: function(status) {
        var ret = [];
        for(var i = 0; i < 16; i++) {
            ret.push(this.viewCheckbox(status, i));
        }
        return ret;
    },
    
    viewSpectrumLabels: function(status) {
        var pips = [0, 0, 1, 2, 3, 4];
        
        var ret = [];
        var x = 0;
        for(var i = 0; i < 6; i++) {
            var col = [];
            
            for(var j = 0; j < pips[i]; j++) {
                col.push(m("div[class=label]"));
                col.push(m("div"));
                col.push(m("div[class=number]"));
                
                ret.push(m("div",{class: "col " + (status.spectrum > x ? "shaded" : ""), onclick: this.statusCheck(status, x)}, col));
                x += 1;
                col = [];
            }
            
            if(i == 4) {
                col.push(m("div[class=label]", "OUT"));
            } else if(i == 5) {
                col.push(m("div[class=label]", "MC"));
            } else {
                col.push(m("div[class=label]"));
            }
            
            col.push(m("div"));
            col.push(m("div[class=number]", "" + (i + 1)));
            ret.push(m("div",{class: "col " + (status.spectrum > x ? "shaded" : ""), onclick: this.statusCheck(status, x)}, col));
            x += 1;
            
        }
        return ret;
    },
    
    viewTags: function(status) {
        
        
        var ret = [];
        
        for(var i = 0; i < 16; i++) {
            var label = "";
            if(i == 10) label = "OUT";
            if(i == 15) label = "MC"
            ret.push(m("div", { class: "label" + (status.spectrum > i ? " shaded" : ""), onclick: this.statusCheck(status, i) }, label));
            
        }
        return ret;
    },
    
    view: function(vnode) {
        var status = vnode.attrs.status;
        return m("div[class=status]", [
            m("i[class=fa fa-2x fa-times-circle-o close]", {onclick: vnode.attrs.del}),
            m("div[class=header]", {
				class: status.selected || null,
				onclick: () => {
					if(!status.selected) {
						status.selected = "minus";
					} else if(status.selected == "minus") {
						status.selected = "plus";
					} else if(status.selected == "plus") {
						delete status.selected;
					}
					save();
				}
			},
			[
                "STATUS SPECTRUM CARD",
            ]),
            m("div[class=inner]", this.viewSpectrumLabels(status)),
            m("div[class=tagwrap]", [
                m("div[class=taglabel]", "TAG"),
                m("div[class=tag]", {onclick: () => {
                    status.name = editString(status.name);
                    save();
                }}, status.name),
            ]),
            m("div[class=help]", "When you get a status, mark its tier. When you get another on the same spectrum: A greater tier replaces the current; an equal tier increases the current by 1; for a smaller tier, mark a number of boxes equal to its tier right of the current mark and if you hit the next tier up, it replaces the current.")
        ]);
    }
}