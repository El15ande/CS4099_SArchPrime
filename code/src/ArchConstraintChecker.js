export default class ArchConstraintChecker {
    constructor(config) {
        this.configuration = config;
        this.constraints = [];
        this.idCount = 0;

        this.checkConnectorDirection();
    }

    getConstraints = function() {
        return this.constraints.length > 0
            ? this.constraints
            : [{ name: 'No inconsistencies detected', icon: 'mdi-check-all' }];
    }

    checkConnectorDirection = function() {
        let invalidConnectors = [];
        let source, target;
        let ic = {};

        this.configuration.connector.forEach((cn) => {
            this.configuration.component.forEach((cp) => {
                if(cn.source.cpid === cp.cpid) {
                    ic.sourcecp = cp;
                    source = cp.cpintf.filter((i) => cn.source.iid === i.iid)[0];
                }
                if(cn.target.cpid === cp.cpid) {
                    ic.targetcp = cp;
                    target = cp.cpintf.filter((i) => cn.target.iid === i.iid)[0];
                }
            });

            if((source.itype === target.itype && source.itype !== 'Non-directional')
            || (source.itype !== target.itype && (source.itype === 'Non-directional' || target.itype === 'Non-directional'))) {
                ic.sourcei = source;
                ic.targeti = target;
                ic.cn = cn;
                invalidConnectors.push(ic);
                ic = {};
            }     
        });

        if(invalidConnectors.length > 0) {
            this.constraints.push({
                id: ++this.idCount, 
                name: 'Inconsistency: mismatched interfaces',
                icon: 'mdi-alert-box',
                children: invalidConnectors.map((ic) => {
                    return {
                        id: ++this.idCount,
                        name: `${ ic.sourcecp.cpname } - ${ ic.targetcp.cpname }`,
                        icon: 'mdi-alert-box-outline',
                        dialog: {
                            title: 'Mismatched interface',
                            explanation: [
                                `Component 1: ${ ic.sourcecp.cpname }, 
                                    Interface: ${ ic.sourcei.iname ? ic.sourcei.iname : 'unnamed' }, 
                                    Interface type: ${ ic.sourcei.itype }`,
                                `Component 2: ${ ic.targetcp.cpname }, 
                                    Interface: ${ ic.targeti.iname ? ic.targeti.iname : 'unnamed' }, 
                                    Interface type: ${ ic.targeti.itype }`
                            ]
                        }
                    }
                }),
                dialog: {
                    explanation: [
                        'Two connected interfaces needed to be matched in type:',
                        '1. An input interface must match with an output interface.',
                        '2. A non-directional interface must match with another non-directional interface.'
                    ]
                }
            });
        }

        return this;
    }
}