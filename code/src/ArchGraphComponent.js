import * as JOINT from 'jointjs'

export default class ArchGraphComponent {
    constructor(data) {
        this.jointComponent = new JOINT.shapes.devs.Model({
            cpid: data.cpid,
            
            attrs: {
                '.label': {
                    text: data.cpname,
                    'y': data.canvas.height / 2 - 5, // Font position;
                    'font-size': 20 // Font size;
                },
            },

            position: {
                x: data.canvas.x,
                y: data.canvas.y
            },

            size: {
                width: data.canvas.width,
                height: data.canvas.height
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