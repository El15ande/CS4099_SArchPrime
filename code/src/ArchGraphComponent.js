import * as JOINT from 'jointjs'

export default class ArchGraphComponent {
    constructor(name) {
        this.jointComponent = new JOINT.shapes.devs.Model({
            attrs: {
                '.label': {
                    text: name
                }
            },

            position: {
                x: 100,
                y: 100
            },

            size: {
                width: 200,
                height: 100
            },

            inPorts: [],

            outPorts: []
        });
    }

    // Add the component to paper;
    //  paper: joint paper;
    addTo(paper) {
        this.jointComponent.addTo(paper);
    }
}