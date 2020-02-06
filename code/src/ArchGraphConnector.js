import * as JOINT from 'jointjs';

export default class ArchGraphConnector {
    constructor(data) {
        this.jointConnector = new JOINT.shapes.devs.Link({
            source: data.source,
            target: data.target
        });
    }

    // Add the component to paper;
    //  paper: joint paper;
    addTo(paper) {
        this.jointConnector.addTo(paper);
    }
}