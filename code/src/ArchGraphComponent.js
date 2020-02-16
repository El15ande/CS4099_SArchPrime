import * as JOINT from 'jointjs';
import ArchGraphInterface from './ArchGraphInterface';

export default class ArchGraphComponent {
    constructor(data, intera) {
        this.jointComponent = new JOINT.shapes.standard.Rectangle({
            attrs: {
                body: {
                    'stroke': intera ? '#9FA8DA' : '#333333',
                    'fill': intera ? '#9FA8DA' : '#FFFFFF',
                    'fill-opacity': intera ? 0.05 : 1
                },
                label: intera 
                    ? {} 
                    : {
                        text: data.cpname ? data.cpname : null,
                        'font-size': 20
                    }
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
                    'Left': {
                        position: { name: 'left' },
                        label: {
                            position: { 
                                name: 'bottom',
                                args: { y: 25 }
                            }
                        },
                        attrs: {
                            '.joint-port-body': { magnet: true },
                            '.joint-port-label': { fontSize: 15 }
                        }
                    },
                    'Right': {
                        position: { name: 'right' },
                        label: {
                            position: { 
                                name: 'bottom',
                                args: { y: 25 }
                            }
                        },
                        attrs: {
                            '.joint-port-body': { magnet: true },
                            '.joint-port-label': { fontSize: 15 }
                        }
                    },
                    'Top': {
                        position: { name: 'top' },
                        label: {
                            position: { 
                                name: 'inside',
                                args: { offset: 15 } 
                            }
                        },
                        attrs: {
                            '.joint-port-body': { magnet: true },
                            '.joint-port-label': { fontSize: 15 }
                        }
                    },
                    'Bottom': {
                        position: { name: 'bottom' },
                        label: {
                            position: { 
                                name: 'inside',
                                args: { offset: 15 } 
                            }
                        },
                        attrs: {
                            '.joint-port-body': { magnet: true },
                            '.joint-port-label': { fontSize: 15 }
                        }
                    }
                }
            },

            cpid: intera ? intera : (data.cpid ? data.cpid : -1)
        });

        this.cpname = data.cpname;
        this.jointInterfaces = [];

        data.cpintf.map((intf) => { 
            let port = new ArchGraphInterface(intf);
            this.jointInterfaces.push(port);
            this.jointComponent.addPort(port.jointPort);
        });
    }

    // Add the component to paper;
    //  paper: joint paper;
    addTo(paper) {
        this.jointComponent.addTo(paper);
    }
}