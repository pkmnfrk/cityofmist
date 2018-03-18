import m from 'mithril';

import { save, isLocked, editString } from './common';

export default {
    view: function(vnode) {
        var char = vnode.attrs.char;
        
        return [
            m("div[class=name]", { onclick: () => {
                if(!isLocked()) {
                    char.name = editString(char.name);
                    save();
                }
            }}, char.name)
        ];
    }
};