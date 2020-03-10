export default class ArchConstraintChecker {
    constructor(config) {
        this.configuration = config;
        this.constraints = [];

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

        this.configuration.connector.forEach((cn) => {
            this.configuration.component.forEach((cp) => {
                if(cn.source.cpid === cp.cpid) source = cp.cpintf.filter((i) => cn.source.iid === i.iid)[0];
                if(cn.target.cpid === cp.cpid) target = cp.cpintf.filter((i) => cn.target.iid === i.iid)[0];
            });

            if((source.itype === target.itype && source.itype !== 'Non-directional')
            || (source.itype !== target.itype && (source.itype === 'Non-directional' || target.itype === 'Non-directional'))) invalidConnectors.push(cn);
        });

        if(invalidConnectors.length > 0) {
            this.constraints.push({ 
                name: 'Inconsistency: mismatched interfaces',
                icon: 'mdi-alert-box',
                children: invalidConnectors.map((cn) => {
                    return {
                        name: cn.cnlabel,
                        icon: 'mdi-alert-box-outline'
                    }
                })
            });
        }

        return this;
    }
}