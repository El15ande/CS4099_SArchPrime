export class ProtoComponent {
    symbol:Symbol;
    protected master?:ProtoConfiguration;

    constructor(master?:ProtoConfiguration, isConfiguration?:boolean) {
        this.symbol = Symbol(isConfiguration ? 'configuration' : 'component');
        this.master = master;
    }
}

export class ProtoConnector {
    symbol:Symbol = Symbol('connector');
    private master?:ProtoConfiguration;
    private isDirected:boolean = false;

    constructor(master?:ProtoConfiguration) {
        this.master = master;
    }
}

export type ProtoInteraction = [ProtoConnector, ProtoComponent];

export class ProtoConfiguration extends ProtoComponent {
    private components:Set<ProtoComponent>;
    private connectors:Set<ProtoConnector>;
    private senders:Set<ProtoInteraction>;
    private receivers:Set<ProtoInteraction>;

    private interfaces:Set<ProtoComponent>;
    private dependencies:Set<ProtoComponent>;

    constructor(master?:ProtoConfiguration) {
        super(master, true);

        this.components = new Set<ProtoComponent>;
        this.connectors = new Set<ProtoConnector>;
        this.senders = new Set<ProtoInteraction>;
        this.receivers = new Set<ProtoInteraction>;
        this.interfaces = new Set<ProtoComponent>;
        this.dependencies = new Set<ProtoComponent>;
    }
}