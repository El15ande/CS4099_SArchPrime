export default class ArchConstraintChecker {
    constructor(config) {
        this.configuration = config;
        this.constraints = [];
        this.idCount = 0;

        this.configuration.component.forEach(cp => cp.cpintf.map(i => i.icount = 0));

        this
            ._pushConstraints(this._checkMismatchedInterfaces(), {
                name: 'Inconsistency: Mismatched Interfaces',
                icon: 'mdi-alert-box',
                explanation: [
                    'Two connected interfaces needed to be matched in type:',
                    '1. An input interface must match with an output interface.',
                    '2. A non-directional interface must match with another non-directional interface.'
                ]
            },
            (i) => {
                return {
                    id: ++this.idCount,
                    name: `${ i.sourcecp.cpname } - ${ i.targetcp.cpname }`,
                    icon: 'mdi-alert-box-outline',
                    dialog: {
                        title: 'Mismatched Interface',
                        explanation: [
                            `Component 1: ${ i.sourcecp.cpname }, 
                                Interface: ${ i.sourcei.iname ? i.sourcei.iname : 'unnamed' }, 
                                Interface type: ${ i.sourcei.itype }.`,
                            `Component 2: ${ i.targetcp.cpname }, 
                                Interface: ${ i.targeti.iname ? i.targeti.iname : 'unnamed' }, 
                                Interface type: ${ i.targeti.itype }.`
                        ]
                    }
                }
            })
            ._pushConstraints(this._checkUnconnectedInterfaces(), {
                name: 'Inconsistency: unconnected interface',
                icon: 'mdi-alert-box',
                explanation: [
                    'An interface has to match with other interface(s).'
                ]
            },
            (i) => {
                return {
                    id: ++this.idCount,
                    name: `${ i.component.cpname }: ${ i.interface.iname ? i.interface.iname : i.interface.ipos + ' unnamed interface' }`,
                    icon: 'mdi-alert-box-outline',
                    dialog: {
                        title: 'Unconnected Interface',
                        explanation: [
                            `Component: ${ i.component.cpname }`,
                            `Interface: ${ i.interface.ipos } ${ i.interface.itype} ${ i.interface.iname ? i.interface.iname: 'unnamed' } interface.`
                        ]
                    }
                }
            })
    }

    getConstraints = function() {
        return this.constraints.length > 0
            ? this.constraints
            : [{ name: 'No inconsistencies detected', icon: 'mdi-check-all' }];
    }

    _pushConstraints = function(arr, { name, icon, explanation }, childProcessor) {
        if(arr.length > 0) {
            this.constraints.push({
                id: ++this.idCount, 
                name,
                icon,
                children: arr.map(childProcessor),
                dialog: { explanation }
            });
        }

        return this;
    }

    _checkMismatchedInterfaces = function() {
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

        return invalidConnectors;
    }

    _checkUnconnectedInterfaces = function() {
        let unlinkedInterfaces = [];
        let ui = {};

        let addInterfaceCount = (cpid, iid) => {
            this.configuration.component[cpid-1].cpintf[iid-1].icount++;
        }

        this.configuration.connector.forEach((cn) => {
            addInterfaceCount(cn.source.cpid, cn.source.iid);
            addInterfaceCount(cn.target.cpid, cn.target.iid);
        });

        this.configuration.component.forEach((cp) => {
            cp.cpintf.forEach((i) => {
                if(i.icount == 0) {
                    ui.component = cp;
                    ui.interface = i;
                    unlinkedInterfaces.push(ui);
                    ui = {};
                }
            });
        });

        return unlinkedInterfaces;
    }
}