import { AxiosRequest } from './main.js';

export default class ArchDataModifier {
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

    makeViewpointConnection = function() {
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



    /*
        Viewpoints;
    */
    
    // Get all viewpoints names;
    getViewModel = function() {
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

    updateViewpoint = function(attr, vpname, newValue) {
        switch (attr) {
            case 'position':
                this.data[vpname].canvas.x = newValue.x;
                this.data[vpname].canvas.y = newValue.y;
                break;
            default: break;
        }

        return this;
    };

    /*
        Viewpoint connections;
    */

    getViewpointConnections = function() {
        return this.data.connections;
    };

    addViewpointConnection = function(source, target) {
        let connection = this.makeViewpointConnection();
        connection.source = source;
        connection.target = target;

        this.data.connections.push(connection);

        return this;
    };

    deleteViewpointConnection = function(source, target) {
        this.data.connections = this.data.connections.filter((c) => {
            return JSON.stringify({ source, target }) !== JSON.stringify({ source: c.source, target: c.target });
        });

        return this;
    };

    updateViewpointConnection = function(attr, before, after) {
        let oldConnection = { source: before.lsource, target: before.ltarget };

        this.data.connections.map((c) => {
            if(JSON.stringify(oldConnection) === JSON.stringify({ source: c.source, target: c.target })) {
                switch(attr) {
                    case 'length':
                        c.source = after.newSource;
                        c.target = after.newTarget;
                        break;
                    case 'label':
                        c.labels.push(after);
                        break;
                    case 'clear':
                        c.labels = [];
                        break;
                    default: break;
                }
            }
        });
        return this;
    };



    /*
        Components;
    */
   
}