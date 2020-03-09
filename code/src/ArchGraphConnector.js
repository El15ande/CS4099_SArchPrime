import * as JOINT from 'jointjs';

export default class ArchGraphConnector {
    constructor(data) {
        this.jointConnector = new JOINT.shapes.devs.Link({
            source: data.source,
            target: data.target
        });
        
        if(data.label) this.jointConnector.appendLabel({ attrs: { text: { text: data.label } } });
    }

    // Add the component to paper;
    //  paper: joint paper;
    addTo = function(paper) {
        this.jointConnector.addTo(paper);
    }
}