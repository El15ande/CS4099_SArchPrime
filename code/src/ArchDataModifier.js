import { AxiosRequest } from './main.js';

const viewpointPrototype = {
    component: [],
    connector: []
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

    getViewpoints = function() {
        return this.data.indices;
    }

    // Add new unique viewpoint;
    //  vpname: new viewpoint name;
    addViewpoint = function(vpname) {
        if(this.data.indices.indexOf(vpname) < 0) {
            let viewpoint = Object.assign({}, viewpointPrototype);

            this.data[vpname] = viewpoint;
            this.data.indices.push(vpname);
        }

        return this;
    }

    // Delete a unique viewpoint;
    //  vpname: target viewpoint name;
    deleteViewpoint = function(vpname) {
        let _this = this;
        let position = this.data.indices.indexOf(vpname);

        if(position > -1) {
            delete _this.data[vpname];
            this.data.indices.splice(position, 1);
        }

        return this;
    }
}