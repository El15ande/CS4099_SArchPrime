import { AxiosRequest } from './main.js';

const CANVAS_PROTOTYPE = {
    x: 0,
    y: 0,
    width: 300,
    height: 150
};

const VIEWPOINT_PROTOTYPE = {
    canvas: CANVAS_PROTOTYPE,

    /*
        Components array;
    */
    component: [],

    /*
        Connectors array;
    */
    connector: []
};

const COMPONENT_PROTOTYPE = {
    canvas: CANVAS_PROTOTYPE,

    /*
        Component name;
    */
    cpname: '',

};

export default class ArchDataModifier {
    constructor(data) {
        this.data = data;
    }

    // Post current data to the server;
    save = function() {
        AxiosRequest('POST', `arch/${this.data.name}`, this.data);

        return this;
    }



    /*
        Viewpoints;
    */
    
    // Get all viewpoints names;
    getViewpoints = function() {
        return this.data.indices;
    }

    // Get a viewpoint through name;
    //  vpname: target viewpoint name;
    getViewpoint = function(vpname) {
        return this.data[vpname];
    }

    // Add new unique viewpoint;
    //  vpname: new viewpoint name;
    addViewpoint = function(vpname) {
        if(this.data.indices.indexOf(vpname) < 0) {
            let viewpoint = Object.assign({}, VIEWPOINT_PROTOTYPE);

            this.data[vpname] = viewpoint;
            this.data.indices.push(vpname);
        }

        return this;
    }

    // Delete a unique viewpoint;
    //  vpname: target viewpoint name;
    deleteViewpoint = function(vpname) {
        delete this.data[vpname];

        return this;
    }

    updateViewpoint = function(attr, vpname, newValue) {
        switch (attr) {
            case 'position':
                this.data[vpname].canvas.x = newValue.x;
                this.data[vpname].canvas.y = newValue.y;
                break;
            default: break;
        }

        return this;
    }



    /*
        Components;
    */
   
}