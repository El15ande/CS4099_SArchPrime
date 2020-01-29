import * as JOINT from 'jointjs'
import ArchGraphInterface from './ArchGraphInterface';

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
                    'Input': {
                        position: { name: 'top' },
                        attrs: {
                            '.joint-port-body': { magnet: true }
                        }
                    },
                    'Output': {
                        position: { name: 'bottom' },
                        attrs: {
                            '.joint-port-body': { magnet: true }
                        }
                    }
                }
            },

            cpid: data.cpid,
        });

        this.cpname = data.cpname;
        this.jointInterfaces = [];

        data.cpintf.map((intf) => { 
            let port = new ArchGraphInterface(intf);
            this.jointInterfaces.push(port);
            this.jointComponent.addPort(port.jointInterface);
        });
    };

    // Add the component to paper;
    //  paper: joint paper;
    addTo(paper) {
        this.jointComponent.addTo(paper);
    };
}