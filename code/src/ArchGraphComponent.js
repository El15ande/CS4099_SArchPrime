import * as JOINT from 'jointjs'

export default class ArchGraphComponent {
    constructor(data) {
        this.jointComponent = new JOINT.shapes.standard.Rectangle({
            attrs: {
                label: {
                    text: data.cpname,
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

            ports: {
                groups: {
                    'input': {
                        position: { name: 'top' }
                    },
                    'output': {
                        position: { name: 'bottom' }
                    }
                }
            },



            cpid: data.cpid,
        });

        this.cpname = data.cpname;
    };

    // Add the component to paper;
    //  paper: joint paper;
    addTo(paper) {
        this.jointComponent.addTo(paper);
    };
}