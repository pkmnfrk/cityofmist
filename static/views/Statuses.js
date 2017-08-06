var Statuses = {
    deleteStatus: function(statuses, status) {
        for(var i = 0; i < statuses.length; i++) {
            if(statuses[i] == status) {
                statuses.splice(i, 1);
                break;
            }
        }
        
        save();
    },
    
    addStatus: function(statuses) {
        var newStatus = {
            spectrum: 1
        };
        
        statuses.push(newStatus);
        
        save();
    },
    
    view: function(vnode) {
        var statuses = vnode.attrs.statuses;
        
        return [
            statuses.map(s =>
                m(Status, {
                    status: s,
                    del: () => {
                        this.deleteStatus(statuses, s);
                    }
                })
             
            ),
            m("button[class=newstatus]", {onclick: () => {this.addStatus(statuses)}}, "Add status")
        ];
    }
};