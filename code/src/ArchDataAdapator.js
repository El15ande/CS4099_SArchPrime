import { EVENTBUS, AxiosRequest } from './main.js';

export default class ArchDataAdapator {
    constructor(data) {
        this.data = data;
        this.archQueue = [];
    }

    // Get the last element in archQueue;
    qlast = function() {
        let last = null;

        if(this.archQueue.length !== 0) last = this.archQueue[this.archQueue.length - 1];

        return last;
    };

    // Push payload into archQueue;
    //  payload: item to be pushed;
    qpush = function(payload) {
        let lastItem = this.qlast();

        if(lastItem === null || lastItem.cid !== payload.cid || lastItem.cname !== payload.cname) {
            this.archQueue.push(payload);
        }

        return this;
    };

    // Pop the last element in archQueue;
    qpop = function() {
        this.archQueue.pop();

        return this;
    };

    // Clear current archQueue;
    qclear = function() {
        this.archQueue.length = 0;

        return this;
    };



    // Post current data to the server;
    save = function() {
        AxiosRequest('POST', `arch/${this.data.name}`, this.data);

        return this;
    };

    makeCanvas = function() {
        return {
            x: 0,
            y: 0,
            width: 240,
            height: 120
        };
    };

    makeViewpoint = function() {
        let canvas = this.makeCanvas();

        return {
            canvas,
            
            /*
                Components array;
            */
            component: [],

            /*
                Connectors array;
            */
            connector: []
        };
    };

    makeConnection = function() {
        return {
            /*
                Source point/viewpoint;
            */
            source: '',

            /*
                Target point/viewpoint;
            */
            target: '',

            /*
                Link labels
            */
           labels: []
        }
    };

    makeComponent = function() {
        let canvas = this.makeCanvas();

        return {
            canvas,

            /*
                Component & connector hierarchy;
            */
           component: [],
           connector: [],

            /*
                Component unique id;
            */
            cpid: 0,

            /*
                Component name;
            */
            cpname: '',

            /*
                Component interfaces;
            */
           cpintf: []
        }
    };

    makeInterface = function() {
        return {
            /*
                Interface unique id;
            */
           iid: 0,

            /*
                Interface type;
            */
           itype: '',

            /*
                Interface position;
            */
           ipos: '',

            /*
                Interface name;
            */
            iname: '',
           
        }
    };

    makeConnector = function() {
        return {
            source: {
                cpid: 0,
                iid: 0
            },

            target: {
                cpid: 0,
                iid: 0
            }
        }
    };



    /*
        Viewpoints;
    */
    
    // Get all viewpoints names;
    getViewpoints = function() {
        return this.data.indices;
    };

    // Get a viewpoint through name;
    //  vpname: target viewpoint name;
    getViewpoint = function(vpname) {
        return this.data[vpname];
    };

    // Add new unique viewpoint;
    //  vpname: new viewpoint name;
    addViewpoint = function(vpname) {
        if(this.data.indices.indexOf(vpname) < 0) {
            let viewpoint = this.makeViewpoint();

            this.data[vpname] = viewpoint;
            this.data.indices.push(vpname);
        }

        return this;
    };

    // Delete a unique viewpoint;
    //  vpname: target viewpoint name;
    deleteViewpoint = function(vpname) {
        delete this.data[vpname];

        this.data.connections.map((conn) => {
            if(conn.source === vpname) conn.source = { x: 0, y: 0 };
            if(conn.target === vpname) conn.target = { x: 0, y: 0 };
        });

        return this;
    };

    // Update viewpoint data;
    //  attr: viewpoint attribute that will be changed;
    //      position: viepwoint position;
    //  v: new value;
    //  vpname: target viewpoint name;
    updateViewpoint = function(attr, vpname, v) {
        switch (attr) {
            case 'position':
                this.data[vpname].canvas.x = v.x;
                this.data[vpname].canvas.y = v.y;
                break;
            case 'size':
                this.data[vpname].canvas.width = v.width;
                this.data[vpname].canvas.height = v.height;
                break;
            default: break;
        }

        return this;
    };

    /*
        Viewpoint connections;
    */

    // Get all connections between viewpoints;
    getConnections = function() {
        return this.data.connections;
    };

    // Add a new connection between viewpoints;
    //  source: source viewpoint;
    //  target: target viewpoint;
    addConnection = function(source, target) {
        let connection = this.makeConnection();
        connection.source = source;
        connection.target = target;

        this.data.connections.push(connection);

        return this;
    };

    // Delete a connection;
    //  source: source viewpoint;
    //  target: target viewpoint;
    deleteConnection = function(source, target) {
        this.data.connections = this.data.connections.filter((c) => {
            return JSON.stringify({ source, target }) !== JSON.stringify({ source: c.source, target: c.target });
        });

        return this;
    };

    // Update connection data;
    //  attr: connection attribute that will be changed;
    //      link: relink source and target;
    //      alabel: add label to the connection;
    //      rlabel: remove label from the connection;
    //  before: data 1;
    //  after: data 2;
    updateConnection = function(attr, before, after) {
        let oldConnection = { source: before.lsource, target: before.ltarget };

        this.data.connections.map((c) => {
            if(JSON.stringify(oldConnection) === JSON.stringify({ source: c.source, target: c.target })) {
                switch(attr) {
                    case 'link':
                        c.source = after.newSource;
                        c.target = after.newTarget;
                        break;
                    case 'alabel':
                        c.labels.length = 0;
                        c.labels.push(after);
                        break;
                    case 'rlabel':
                        c.labels.length = 0;
                        break;
                    default: break;
                }
            }
        });
        return this;
    };



    /*
        Configurations;
    */

    // Get configuration/component (containing component & connector arraies) through the archQueue and identification;
    //  cid: configuration/component unique id;
    //  cname: configuration/component name;
    getConfiguration = function(cid, cname) {
        if(cid === 0) { // Viewpoint data;
            return this.data[cname];
        } else { // Hierarhchical component data;
            let configuration = this.data[this.archQueue[0].cname];

            for(let i = 1; i < this.archQueue.length; i++) {
                configuration = configuration.component[configuration.component.findIndex(cp => 
                    (cp.cpid === this.archQueue[i].cid) && (cp.cpname === this.archQueue[i].cname))];
            }
            
            let index = configuration.component.findIndex(cp => (cp.cpid === cid) && (cp.cpname === cname));
            
            return (index === -1)
                ? configuration
                : configuration.component[index];
        }
    };

    // Get treeview items;
    getTree = function(cid, cname) {
        let treeItem;
        let configuration = this.getConfiguration(cid, cname);

        let makeTree = function(cp, parent) {
            let item = { cid: cp.cpid, name: cp.cpname, icon:'mdi-arrow-right-bold-box', parent };
            
            if(cp.component.length > 0) {
                item.icon = 'mdi-arrow-down-bold-box';
                item.children = [];
                cp.component.map(scp => item.children.push(makeTree(scp, item)));
            }

            return item;
        }

        if(configuration.component.length > 0) {
            treeItem = { cid, name: cname, icon: 'mdi-home-analytics', children: []};
            configuration.component.map(cp => treeItem.children.push(makeTree(cp, treeItem)));
        }

        return treeItem
            ? [treeItem]
            : [{ cid, name: cname, icon: 'mdi-home-analytics'}];
    }

    // Add a new component to current configuration;
    //  parent: parent configuration;
    //  cname: new component name;
    addComponent = function(parent, cname) {
        let parentConfig = this.getConfiguration(parent.sid, parent.sname);
        
        if(parentConfig) {
            let component = this.makeComponent();
            component.canvas.x = parent.spos.x;
            component.canvas.y = parent.spos.y;
            component.cpid = parentConfig.component.length + 1;
            component.cpname = cname;

            parentConfig.component.push(component);
        } else EVENTBUS.$emit('ERROR_CONFIGNOTFOUND', parent.sid, parent.sname);

        return this;
    };

    deleteComponent = function(c) {
        let parentConfig = this.getConfiguration(c.sparent.sid, c.sparent.sname);

        if(parentConfig) {
            parentConfig.component = parentConfig.component.filter((cp) => { return !(c.sid === cp.cpid && c.sname === cp.cpname); });
            parentConfig.component = parentConfig.component.map((cp, index) => { return Object.assign({}, cp, { cpid: index + 1 }); });
        } else EVENTBUS.$emit('ERROR_CONFIGNOTFOUND', c.parent.sid, c.parent.sname);

        return this;
    };
    
    // Update component data;
    //  attr: connection attribute that will be changed;
    //      position: change canvas position;
    //      size: adjust canvas size;
    //      aintf: add a new interface to this component;
    //      rintf: remove the target interface;
    //  cid, cname: component key;
    //  v: new value;
    updateComponent = function(attr, cid, cname, v) {
        let component = this.getConfiguration(cid, cname);

        if(component) {
            switch(attr) {
                case 'position': {
                    component.canvas.x = v.x;
                    component.canvas.y = v.y;
                    break;
                }
                case 'size': {
                    component.canvas.width = v.width;
                    component.canvas.height = v.height;
                    break;
                }
                case 'aintf': {
                    let _interface = this.makeInterface();

                    _interface.iid = component.cpintf.length + 1;
                    _interface.itype = v.itype ? v.itype : 'Input';
                    _interface.ipos = v.ipos ? v.ipos : 'Top';
                    _interface.iname = v.iname;
                    component.cpintf.push(_interface);
                    break;
                }
                case 'rintf': {
                    component.cpintf = component.cpintf.filter((intf) => { return intf.iid !== v.iid; });
                    component.cpintf = component.cpintf.map((intf, index) => { return Object.assign({}, intf, { iid: index + 1 }); });
                    break;
                }
                case 'eintf': {
                    component.cpintf = component.cpintf.map((intf) => {
                        let _intf = Object.assign({}, intf);

                        if(v.oldintf.iid === intf.iid) {
                            _intf.itype = v.itype;
                            _intf.ipos = v.ipos;
                            _intf.iname = v.iname;
                        }

                        return _intf;
                    });
                    break;
                }
                default: { break; }
            }
        } else EVENTBUS.$emit('ERROR_CONFIGNOTFOUND', cid, cname);

        return this;
    };

    // Add a new connector to current configuration;
    //  parent: parent configuration;
    //  srccid, srciid: source port ids;
    //  tarcid, tariid: target port ids;
    addConnector(parent, srccid, srciid, tarcid, tariid) {
        let parentConfig = this.getConfiguration(parent.cid, parent.cname);

        if(parentConfig) {
            let connector = this.makeConnector();
            connector.source = { cpid: srccid, iid: srciid };
            connector.target = { cpid: tarcid, iid: tariid };

            parentConfig.connector.push(connector);
        } else EVENTBUS.$emit('ERROR_CONFIGNOTFOUND', parent.sid, parent.sname);

        return this;
    }
}