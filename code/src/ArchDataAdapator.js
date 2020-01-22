import { AxiosRequest } from './main.js';

export default class ArchDataAdapator {
    constructor(data) {
        this.data = data;
    }

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
                Component name;
            */
            cpname: ''
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
                        c.labels = [];
                        c.labels.push(after);
                        break;
                    case 'rlabel':
                        c.labels = [];
                        break;
                    default: break;
                }
            }
        });
        return this;
    };



    /*
        Configuration;
    */

    getConfiguration(c) {
        // console.log(c);
    };
}