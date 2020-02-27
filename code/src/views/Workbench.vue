<template>
    <div>
        <v-menu
            :close-on-click='false'
            :close-on-content-click='false'
            :disable-keys='true'
            :position-x="treeViewX"
            :position-y="treeViewY"
            :value='true'
        >
            <v-treeview
                dark
                hoverable
                selected-color='indigo lighten-4'
                :items='treeViewItems'
            >
                <template v-slot:prepend="{ item }">
                    <a @click="jumpConfiguration(item.cid, item.name)"><v-icon>{{ item.icon }}</v-icon></a>
                </template>
            </v-treeview>
        </v-menu>

        <v-menu
            v-model="jointMenu"
            absolute
            :position-x="menuX"
            :position-y="menuY"
        >
            <v-list
                max-width='350'
                :dense='menuContext === "CFG_INTERAPORT"'
            >
                <v-list-item 
                    v-for='(item, i) in menu'
                    :key='i'
                    :class='item.colourclass'
                    @click.stop='item.action'
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-dialog
            v-model="errorDialog"
            width='500'
        >
            <v-card outlined>
                <v-card-title>An error has occurred.</v-card-title>
                <v-card-text>
                    <div>Error message: {{ errorMessage }}.</div>
                    <div class="error-hint">{{ errorHint }}</div>
                </v-card-text>
                <v-card-actions>
                    <v-btn
                        text
                        color="teal darken-1"
                        @click='errorDialog = false'
                    >
                        OK
                    </v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>

        <v-dialog
            v-model="labelDialog"
            width='500'
        >
            <v-card>
                <v-card-title>{{ labelDialogTitle }}</v-card-title>
                <v-card-actions>
                    <v-text-field
                        v-model="labelInput"
                        outlined
                        label="Label" 
                    />
                </v-card-actions>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        text
                        color="teal darken-1"
                        @click='addConnectorLabel()'
                    >
                        Add/Edit
                    </v-btn>
                    <v-btn
                        text
                        @click='labelDialog = false'
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="customiseDialog"
            width='500'
        >
            <v-card>
                <v-card-title>Customise</v-card-title>
                <v-card-actions>
                    <v-col cols="12">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="newComponentName"
                                    outlined
                                    label="Component name"
                                />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <v-text-field
                                    v-model="customiseWidth"
                                    outlined
                                    label="Current width (block)" 
                                />
                            </v-col>

                            <v-col cols="6">
                                <v-text-field
                                    v-model="customiseHeight"
                                    outlined
                                    label="Current height (block)" 
                                />
                            </v-col>
                        </v-row>
                    </v-col>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        text
                        color="teal darken-1"
                        @click='customise()'
                    >
                        Change
                    </v-btn>
                    <v-btn
                        text
                        @click='customiseDialog = false'
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>



        <v-dialog
            v-model="componentDialog"
            width='500'
        >
            <v-card>
                <v-card-title>Create new component</v-card-title>
                <v-card-actions>
                    <v-col md='12'>
                        <v-text-field
                            v-model="newComponentName"
                            outlined
                            :rules="['Required']"
                            label="Component name" 
                        />
                    </v-col>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        text
                        color="teal darken-1"
                        @click='addComponent()'
                    >
                        Add/Edit
                    </v-btn>
                    <v-btn
                        text
                        @click='componentDialog = false'
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="interfaceDialog"
            width='500'
        >
            <v-card>
                <v-card-title>{{ interfaceDialogTitle }}</v-card-title>
                <v-card-actions>
                    <v-select
                        v-model="newInterfacePos"
                        :items="interfaceItems"
                        :rules="['Required']"
                        label="Interface position"
                    />
                </v-card-actions>
                <v-card-actions>
                    <v-select
                        v-model="newInterfaceType"
                        :items="interfaceTypes"
                        :rules="['Required']"
                        label="Interface type"
                    />
                </v-card-actions>
                <v-card-actions>
                    <v-text-field
                        v-model="newInterfaceName"
                        outlined
                        label="Interface name" 
                    />
                </v-card-actions>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        text
                        color="teal darken-1"
                        @click='addInterface()'
                    >
                        Add/Edit
                    </v-btn>
                    <v-btn
                        text
                        @click='interfaceDialog = false'
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style>
    @import '../../node_modules/jointjs/dist/joint.css';

    .v-content__wrap {
        border: 1px solid #CFD8DC;
    }

    .v-treeview-node {
        background-color: #3949AB;
    }

    /* Hierarchy change background (indigo accent-1) */
    .bg_hierarchy {
        background-color: #8C9EFF;
    }

    /* Creation background (teal accent-1) */
    .bg_create {
        background-color: #A7FFEB;
    }

    /* Deletion background (pink lighten-5) */
    .bg_delete {
        background-color: #FF80AB;
    }
    
    /* Editing background (cyan accent-1) */
    .bg_edit {
        background-color: #84FFFF;
    }

    .tool-remove {
        display: none;
    }
    
    .error-hint {
        font-weight: 750;
    }
</style>

<script>
import { EVENTBUS, AxiosRequest } from '../main.js';
import ArchDataAdaptor from '../ArchDataAdaptor.js';
import ArchGraphComponent from '../ArchGraphComponent.js';
import ArchGraphConnector from '../ArchGraphConnector.js';
import $ from 'jquery';
import * as JOINT from 'jointjs';

export default {
    data() {
        return {
            title: '',
            archDataAdaptor: {},

            jointGraph: null,
            jointPaper: null,
            
            treeViewX: 360,
            treeViewY: 0,
            treeViewItems: [],

            constraintViewX: 1200,
            constraintViewY: 0,

            // Error dialog;
            errorDialog: false,
            errorMessage: 'error',
            errorHint: '',

            // Click menu;
            jointMenu: false,
            menuContext: '',
            menuX: 0,
            menuY: 0,

            // Component cache;
            selectedComponent: {},
            
            // Connector cache;
            selectedConnector: {},



            // Connection label cache;
            labelDialog: false,
            labelDialogTitle: '',
            labelInput: '',

            // Customise cache;
            customiseDialog: false,
            customiseWidth: 0,
            customiseHeight: 0,



            // Hierarchical component;
            componentDialog: false,
            newComponentName: '',

            // Interface;
            interfaceDialog: false,
            interfaceDialogTitle: '',
            interfaceItems: ['Left', 'Right', 'Top', 'Bottom'],
            interfaceTypes: ['Input', 'Output', 'Non-directional'],
            newInterfacePos: '',
            newInterfaceType: '',
            newInterfaceName: '',

            interaConnections: []
        }
    },

    computed: {
        menu() {
            let _this = this;

            switch (this.menuContext) {
                case 'VM_ELEMENT': {
                    return [
                        {
                            name: 'New View Connection',
                            description: 'Create a new connection from this view',
                            colourclass: ['bg_create'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.archDataAdaptor.addConnection(
                                    _this.selectedComponent.sid,
                                    _this.selectedComponent.spos
                                ).save();
                                _this.renderViewModel();
                            }
                        },

                        {
                            name: 'Customise',
                            description: 'Customise the viewpoint pattern',
                            colourclass: ['bg_edit'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.customiseDialog = true;
                                _this.customiseWidth = _this.selectedComponent.ssize.width / 20;
                                _this.customiseHeight = _this.selectedComponent.ssize.height / 20;
                                _this.newComponentName = _this.selectedComponent.sid;
                            }
                        }
                    ];
                }
                case 'VM_LINK': {
                    let addLabel = 
                        {
                            name: 'Add Label',
                            description: 'Add a label to this connection',
                            colourclass: ['bg_create'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.labelDialogTitle = 'Add Label'
                                _this.labelDialog = true;
                            }
                        };
                    
                    let editLabel = 
                        {
                            name: 'Edit Label',
                            description: 'Edit the label pattern',
                            colourclass: ['bg_edit'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.labelDialogTitle = 'Edit Label'
                                _this.labelDialog = true;
                                _this.labelInput = _this.selectedConnector.llabel[0].attrs.text.text;
                            }
                        };
                    
                    let removeLabel =
                        {
                            name: 'Remove Label',
                            description: 'Remove the label from this connection',
                            colourclass: ['bg_delete'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.removeConnectorLabel();
                            }
                        };
                    
                    let removeConnection = 
                        {
                            name:'Remove View Connection',
                            description: 'Remove the connection',
                            colourclass: ['bg_delete'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.archDataAdaptor.removeConnection(
                                    _this.selectedConnector.lsource, 
                                    _this.selectedConnector.ltarget
                                ).save();
                                _this.renderViewModel();
                            }
                        };

                    return _this.selectedConnector.llabel
                        ? [removeLabel, removeConnection, editLabel]
                        : [addLabel, removeConnection];
                }
                case 'VM_BLANK': {
                    return [
                        {
                            name: 'New View',
                            description: 'Create a new view',
                            colourclass: ['bg_create'],
                            action: function() {
                                _this.jointMenu = false;
                                EVENTBUS.$emit('INVOKE_CREATEVIEW');
                            }
                        }
                    ];
                }
                case 'CFG_ELEMENT': {
                    return [
                        {
                            name: 'New Interface',
                            description: 'Add an interface to this component',
                            colourclass: ['bg_create'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.interfaceDialogTitle = 'Create new interface';
                                _this.interfaceDialog = true;
                            }
                        },

                        {
                            name: 'Replicate Component',
                            description: 'Create a new component with the same size & name',
                            colourclass: ['bg_create'],
                            action: function() {
                                _this.jointMenu = false;

                                _this.archDataAdaptor.addComponent({
                                    sid: _this.selectedComponent.sparent.cid,
                                    sname: _this.selectedComponent.sparent.cname
                                }, 
                                `_${_this.selectedComponent.sname}`,
                                {
                                    x: _this.selectedComponent.spos.x,
                                    y: _this.selectedComponent.spos.y,
                                    width: _this.selectedComponent.ssize.width,
                                    height: _this.selectedComponent.ssize.height
                                });

                                _this.renderConfiguration(_this.selectedComponent.sparent.cid, _this.selectedComponent.sparent.cname);
                            }
                        },

                        {
                            name: 'Remove Component',
                            description: 'Remove the component',
                            colourclass: ['bg_delete'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.archDataAdaptor.removeComponent(
                                    _this.selectedComponent
                                ).save();
                                _this.renderConfiguration(_this.selectedComponent.sparent.cid, _this.selectedComponent.sparent.cname);
                            }
                        },

                        {
                            name: 'Customise',
                            description: 'Customise the component pattern',
                            colourclass: ['bg_edit'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.customiseDialog = true;
                                _this.customiseWidth = _this.selectedComponent.ssize.width / 20;
                                _this.customiseHeight = _this.selectedComponent.ssize.height / 20;
                                _this.newComponentName = _this.selectedComponent.sname;
                            }
                        }
                    ];
                }
                case 'CFG_PORT': {
                    return [
                        {
                            name: 'Remove Interface',
                            description: 'Remove the interface',
                            colourclass: ['bg_delete'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.archDataAdaptor.updateComponent(
                                    'rintf',
                                    _this.selectedComponent.sid,
                                    _this.selectedComponent.sname,
                                    _this.selectedComponent.sintf
                                ).save();
                                _this.renderConfiguration(_this.selectedComponent.sparent.cid, _this.selectedComponent.sparent.cname);
                            }
                        },

                        {
                            name: 'Customise',
                            description: 'Customise the interface pattern',
                            colourclass: ['bg_edit'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.interfaceDialogTitle = 'Edit interface';
                                _this.newInterfacePos = _this.selectedComponent.sintf.ipos;
                                _this.newInterfaceType = _this.selectedComponent.sintf.itype;
                                _this.newInterfaceName = _this.selectedComponent.sintf.iname;
                                _this.interfaceDialog = true;
                            }
                        }
                    ];
                }
                case 'CFG_INTERAPORT': {
                    if(_this.interaConnections.length == 0) return [
                        {
                            name: `No related connections`,
                            action: function() { _this.jointMenu = false; }
                        }
                    ];

                    return _this.interaConnections.map((ic) => {
                        return {
                            name: `Related connection: ${ic.name}`,
                            description: `Connection label: ${ic.label}`,
                            action: function() {
                                _this.jointMenu = false;
                                _this.jumpConfiguration(ic.cpi.cpid, ic.name);
                            }
                        }
                    });
                }
                case 'CFG_LINK': {
                    let removeConnector = {
                        name: 'Remove Connector',
                        description: 'Remove the component',
                        colourclass: ['bg_delete'],
                        action: function() {
                            _this.jointMenu = false;
                            _this.archDataAdaptor.removeConnector(_this.selectedConnector).save();
                            _this.renderConfiguration(_this.selectedConnector.sparent.cid, _this.selectedConnector.sparent.cname);
                        }
                    };
                    
                    let addLabel = {
                        name: 'Add Label',
                        description: 'Add a label to this connector',
                        colourclass: ['bg_create'],
                        action: function() {
                            _this.jointMenu = false;
                            _this.labelDialogTitle = 'Add Label'
                            _this.labelDialog = true;
                        }
                    };

                    let removeLabel = {
                        name: 'Remove Label',
                        description: 'Remove the label from this connector',
                        colourclass: ['bg_delete'],
                        action: function() {
                            _this.jointMenu = false;
                            _this.removeConnectorLabel();
                        }
                    };

                    let editLabel = {
                        name: 'Edit Label',
                        description: 'Edit the label pattern',
                        colourclass: ['bg_edit'],
                        action: function() {
                            _this.jointMenu = false;
                            _this.labelDialogTitle = 'Edit Label'
                            _this.labelDialog = true;
                            _this.labelInput = _this.selectedConnector.cnlabel[0].attrs.text.text;
                        }
                    }

                    return _this.selectedConnector.cnlabel
                        ? [removeLabel, removeConnector, editLabel]
                        : [addLabel, removeConnector];
                }
                case 'CFG_BLANK': {
                    return [
                        {
                            name: 'Back',
                            description: 'Return to previous architecture level',
                            colourclass: ['bg_hierarchy'],
                            action: function() {
                                _this.jointMenu = false;
                                
                                if(_this.selectedComponent.sid === 0) {
                                    EVENTBUS.$emit('INVOKE_ENTERVIEW', null);
                                    _this.renderViewModel();
                                } else {
                                    _this.archDataAdaptor.qpop();
                                    let parent = _this.archDataAdaptor.qlast();
                                    _this.renderConfiguration(parent.cid, parent.cname);
                                }
                            }
                        },

                        /*{
                            name: "Relocate treeview",
                            description: "Put the (purple) treeview menu here",
                            colourclass: ['bg_edit'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.treeViewX = _this.selectedComponent.spos.x + 255;
                                _this.treeViewY = _this.selectedComponent.spos.y + 65;
                            }
                        },*/

                        {
                            name: 'New Component',
                            description: 'Create a new component',
                            colourclass: ['bg_create'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.componentDialog = true;
                                _this.newComponentName = '';
                            }
                        }
                    ];
                }
                default: { return []; }
            }
        }
    },

    methods: {
        getCell(vpid) {
            let target = this.jointGraph.getCells().filter((cell) => {
                return cell.vpid === vpid;
            });

            return target[0];
        },

        // Update top bar options;
        setTopBar() {
            let _this = this;

            this.title = this.$route.params.name;
            AxiosRequest('get', `arch/${_this.title}`, null, (res) => {
                if(res.data) _this.archDataAdaptor = new ArchDataAdaptor(res.data);
            });
        },

        setMenuCoordinate(e) {
            this.menuX = e.originalEvent.clientX;
            this.menuY = e.originalEvent.clientY;
        },

        showMenu(flag, evt) {
            this.jointMenu = true;
            this.menuContext = flag;
            this.setMenuCoordinate(evt);
        },

        // Refresh workbench;
        renderViewModel() {
            setTimeout(() => {
                this.jointGraph.clear();
                this.setViewModel();
            }, 400);
        },
        


       // View model configuration setter;
        setViewModel() {
            let viewpoints = this.archDataAdaptor.getViewpoints();
            let connections = this.archDataAdaptor.getConnections();
            let viewpoint, vpshape, conshape;

            sessionStorage.setItem('canvasWidth', $('.v-content__wrap').width());
            sessionStorage.setItem('canvasHeight', $('.v-content__wrap').height());
            this.archDataAdaptor.qclear();
            this.treeViewItems = [];

            viewpoints.map((vp) => {
                viewpoint = this.archDataAdaptor.getViewpoint(vp);

                vpshape = new JOINT.shapes.standard.Rectangle();
                vpshape.position(viewpoint.canvas.x, viewpoint.canvas.y);
                vpshape.resize(viewpoint.canvas.width, viewpoint.canvas.height);
                vpshape.attr({
                    label: { 
                        text: vp,
                        'font-size': 20
                    }
                });
                vpshape.vpid = vp;
                
                vpshape.addTo(this.jointGraph);
            });

            connections.map((c) => {
                conshape = new JOINT.shapes.standard.Link();
                (typeof c.source === 'string')
                    ? conshape.source(this.getCell(c.source))
                    : conshape.source({
                        x: c.source.x,
                        y: c.source.y
                    });
                (typeof c.target === 'string')
                    ? conshape.target(this.getCell(c.target))
                    : conshape.target({
                        x: c.target.x,
                        y: c.target.y
                    });
                
                if(c.label) conshape.appendLabel({ attrs: { text: { text: c.label } } });

                conshape.addTo(this.jointGraph);
            });

            // Cell (viewpoint): drag & drop;
            this.jointPaper.on('element:pointerup', (elementView) => {
                this.archDataAdaptor.updateViewpoint(
                    'position',
                    elementView.model.attr().label.text, 
                    elementView.model.attributes.position
                )
            });

            // Link (connection): drag & drop;
            this.jointPaper.on('link:pointerdown', (linkView) => {
                this.selectedConnector = {
                    lsource: linkView.sourceView 
                        ? linkView.sourceView.model.vpid
                        : linkView.sourcePoint,
                    ltarget: linkView.targetView
                        ? linkView.targetView.model.vpid
                        : linkView.targetPoint,
                    llabel: linkView.model.attributes.labels
                };
            });

            this.jointPaper.on('link:pointerup', (linkView, evt, x, y) => {
                let newPoint = new JOINT.g.Point(x, y);
                let nearbyElements = this.jointGraph.findModelsFromPoint(newPoint);
                
                if(nearbyElements.length !== 0) {
                    if(linkView.sourcePoint.x === x && linkView.sourcePoint.y === y) {
                        this.archDataAdaptor.updateConnection(
                            'link',
                            this.selectedConnector,
                            {
                                newSource: nearbyElements[0].vpid,
                                newTarget: linkView.targetView
                                    ? linkView.targetView.model.vpid
                                    : linkView.targetPoint
                            }
                        ).save();
                    } else if(linkView.targetPoint.x === x && linkView.targetPoint.y === y) {
                        this.archDataAdaptor.updateConnection(
                            'link',
                            this.selectedConnector,
                            {
                                newSource: linkView.sourceView
                                    ? linkView.sourceView.model.vpid
                                    : linkView.sourcePoint,
                                newTarget: nearbyElements[0].vpid
                            }
                        ).save();
                    }
                } else {
                    this.archDataAdaptor.updateConnection(
                        'link',
                        this.selectedConnector,
                        {
                            newSource: linkView.sourceView
                                ? linkView.sourceView.model.vpid
                                : linkView.sourcePoint,
                            newTarget: linkView.targetView
                                ? linkView.targetView.model.vpid
                                : linkView.targetPoint
                        }
                    ).save();
                }

                this.renderViewModel();
            });

            // Cell (viewpoint): left double click; 
            this.jointPaper.on('element:pointerdblclick', (elementView) => {
                EVENTBUS.$emit('INVOKE_ENTERVIEW', elementView.model.attr().label.text);
            });

            // Cell (viewpoint): right click;
            this.jointPaper.on('element:contextmenu', (elementView, evt) => {
                this.showMenu('VM_ELEMENT', evt);
                this.selectedComponent = {
                    sid: elementView.model.vpid,
                    spos: {
                        x: elementView.model.attributes.position.x + elementView.model.attributes.size.width / 2,
                        y: elementView.model.attributes.position.y + elementView.model.attributes.size.height + 40
                    },
                    ssize: elementView.model.attributes.size
                };
            });

            // Link (connection): right click;
            this.jointPaper.on('link:contextmenu', (linkView, evt) => {
                this.showMenu('VM_LINK', evt);
                this.selectedConnector = {
                    lsource: linkView.sourceView 
                        ? linkView.sourceView.model.vpid
                        : linkView.sourcePoint,
                    ltarget: linkView.targetView
                        ? linkView.targetView.model.vpid
                        : linkView.targetPoint,
                    llabel: linkView.model.attributes.labels
                };
            });

            // Blank space: right click;
            this.jointPaper.on('blank:contextmenu', (evt) => {
                this.showMenu('VM_BLANK', evt);
                this.selectedComponent.spos = {
                    x: evt.offsetX,
                    y: evt.offsetY
                }
            });
        },
        
        // Add link (connection/connector) label;
        addConnectorLabel() {
            this.labelDialog = false;

            if(this.menuContext === 'VM_LINK') {
                this.archDataAdaptor.updateConnection(
                    'alabel',
                    this.selectedConnector,
                    this.labelInput
                ).save();

                this.renderViewModel();
            } else {
                this.archDataAdaptor.updateConnector(
                    'alabel',
                    this.selectedConnector.sparent,
                    { source: this.selectedConnector.source, target: this.selectedConnector.target },
                    this.labelInput
                ).save();

                this.renderConfiguration(this.selectedConnector.sparent.cid, this.selectedConnector.sparent.cname);
            }

            this.labelInput = '';
        },

        // Remove link (connection/connector) label;
        removeConnectorLabel() {
            if(this.menuContext === 'VM_LINK') {
                this.archDataAdaptor.updateConnection(
                    'rlabel',
                    this.selectedConnector
                ).save();

                this.renderViewModel();
            } else {
                this.archDataAdaptor.updateConnector(
                    'rlabel',
                    this.selectedConnector.sparent,
                    { source: this.selectedConnector.source, target: this.selectedConnector.target }
                );

                this.renderConfiguration(this.selectedConnector.sparent.cid, this.selectedConnector.sparent.cname);
            }
        },

        // Customise component style;
        customise() {
            this.customiseDialog = false;

            if(this.menuContext === 'VM_ELEMENT') {
                this.archDataAdaptor.updateViewpoint(
                    'customise',
                    this.selectedComponent.sid,
                    {
                        name: this.newComponentName,
                        width: Math.ceil(this.customiseWidth) * 20,
                        height: Math.ceil(this.customiseHeight) * 20,
                    }
                ).save();

                EVENTBUS.$emit('RETURN_ARCHVIEWS', this.archDataAdaptor.getViewpoints())
                this.renderViewModel();
            } else if(this.menuContext === 'CFG_ELEMENT') {
                this.archDataAdaptor.updateComponent(
                    'customise',
                    this.selectedComponent.sid,
                    this.selectedComponent.sname,
                    {
                        name: this.newComponentName,
                        width: Math.ceil(this.customiseWidth) * 20,
                        height: Math.ceil(this.customiseHeight) * 20
                    }
                ).save();

                this.renderConfiguration(this.selectedComponent.sparent.cid, this.selectedComponent.sparent.cname);
            }

            this.newComponentName = '';
        },

        // Deregister viewpoint/connection events;
        deregisterViewModel() {
            this.jointPaper.off('element:pointerup');
            this.jointPaper.off('link:pointerdown');
            this.jointPaper.off('link:pointerup');
            this.jointPaper.off('element:pointerdblclick');
            this.jointPaper.off('element:contextmenu');
            this.jointPaper.off('link:contextmenu');
            this.jointPaper.off('blank:contextmenu');

            this.selectedComponent = {};
            this.selectedConnector = {};
        },



        // Hierarchical configuration setter;
        renderConfiguration(cid, cname) {
            let configuration = this.archDataAdaptor.getConfiguration(cid, cname);
            let componentShape, connectorShape, connectorSrc, connectorTar, interaConfig;
            let sparent = { cid, cname };

            if(configuration) {
                this.jointGraph.clear();
                this.deregisterConfiguration();
                this.archDataAdaptor.qpush(sparent);
                
                this.treeViewItems = this.archDataAdaptor.getTree(); // Treeview;

                if(configuration.component.length > 0) {
                    // Intera configuration;
                    interaConfig = new ArchGraphComponent({
                        canvas: this.archDataAdaptor.getInteraCanvas(configuration.component.map(c => { return c.canvas; })),
                        cpintf: configuration.cpintf ? [...configuration.cpintf] : []
                    }, 'interaConfig');
                    interaConfig.addTo(this.jointGraph);

                    configuration.component.map((data) => {
                        componentShape = new ArchGraphComponent(data);

                        componentShape.addTo(this.jointGraph);
                    });
                }
                
                configuration.connector.map((data) => {
                    this.jointGraph.getElements().map((e) => {
                        if(data.source.cpid === e.attributes.cpid) {
                            e.getPorts().map((p) => { 
                                if(data.source.iid === p.attrs.iid) connectorSrc = { id: e.id, port: p.id };
                            });
                        }
                        
                        if(data.target.cpid === e.attributes.cpid) {
                            e.getPorts().map((p) => {
                                if(data.target.iid === p.attrs.iid) connectorTar = { id: e.id, port: p.id };
                            });
                        }
                    });
                    
                    connectorShape = new ArchGraphConnector({ source: connectorSrc, target: connectorTar, label: data.cnlabel }); 
                    connectorShape.addTo(this.jointGraph);
                });

                // Blank space: right click;
                this.jointPaper.on('blank:contextmenu', (evt) => {
                    this.showMenu('CFG_BLANK', evt);
                    this.selectedComponent = {
                        sid: cid,
                        sname: cname,
                        spos: {
                            x: evt.offsetX,
                            y: evt.offsetY
                        }
                    };
                });

                // Component: left double click;
                this.jointPaper.on('element:pointerdblclick', (elementView) => {
                    if(elementView.model.attributes.cpid === 'INTERA') return;

                    this.renderConfiguration(elementView.model.attributes.cpid, elementView.model.attr().label.text);
                });

                // Component: drag & drop;
                this.jointPaper.on('element:pointerup', (elementView) => {
                    // Update intera configuration;
                    let configuration = this.archDataAdaptor.getConfiguration(cid, cname);
                    let interaConfig;

                    if(elementView.model.attributes.cpid !== 'INTERA') {
                        this.archDataAdaptor.updateComponent(
                            'position',
                            elementView.model.attributes.cpid,
                            elementView.model.attr().label.text,
                            elementView.model.attributes.position
                        );
                    }

                    if(configuration) {
                        this.jointGraph.getElements().map((e) => {
                            if(e.attributes.cpname === 'interaConfig') {
                                interaConfig = this.archDataAdaptor.getInteraCanvas(configuration.component.map(c => { return c.canvas; }));
                                e.position(interaConfig.x, interaConfig.y);
                                e.resize(interaConfig.width, interaConfig.height);
                            }
                        });
                    }                    
                });

                // Component: right click;
                this.jointPaper.on('element:contextmenu', (elementView, evt) => {
                    this.showMenu(
                        elementView.model.attributes.cpname === 'interaConfig' ? 'CFG_BLANK' : 'CFG_ELEMENT',
                        evt
                    );

                    this.selectedComponent = elementView.model.attributes.cpname === 'interaConfig'
                        ? {
                            sid: cid,
                            sname: cname,
                            spos: {
                                x: evt.offsetX,
                                y: evt.offsetY
                            }
                        }
                        : {
                            sid: elementView.model.attributes.cpid,
                            sname: elementView.model.attr().label.text,
                            spos: {
                                x: evt.offsetX,
                                y: evt.offsetY
                            },
                            ssize: elementView.model.attributes.size,
                            sparent
                        };
                });

                this.jointPaper.on('element:magnet:contextmenu', (elementView, evt, magnet) => {
                    let target = elementView.model.getPort(magnet.getAttribute('port'));
                    evt.stopPropagation();

                    if(elementView.model.attributes.cpname === 'interaConfig') {
                        let parent = this.archDataAdaptor.getConfiguration(this.archDataAdaptor.qlast(2).cid, this.archDataAdaptor.qlast(2).cname);
                        this.interaConnections.length = 0;
                        
                        parent.connector.map((cn) => {
                            if(cn.source.cpid === cid && cn.source.iid === target.attrs.iid) {
                                this.interaConnections.push({ 
                                    name: parent.component.filter((cp) => { return cp.cpid === cn.target.cpid; })[0].cpname, 
                                    label: cn.cnlabel,
                                    cpi: cn.target 
                                });
                            } else if(cn.target.cpid === cid && cn.target.iid === target.attrs.iid) {
                                this.interaConnections.push({ 
                                    name: parent.component.filter((cp) => { return cp.cpid === cn.source.cpid; })[0].cpname, 
                                    label: cn.cnlabel,
                                    cpi: cn.source 
                                });
                            }
                        });

                        this.showMenu('CFG_INTERAPORT', evt);
                    } else {
                        this.showMenu('CFG_PORT', evt);

                        this.selectedComponent = {
                            sid: elementView.model.attributes.cpid,
                            sname: elementView.model.attr().label.text,
                            spos: {
                                x: evt.offsetX,
                                y: evt.offsetY
                            },
                            ssize: elementView.model.attributes.size,
                            sparent,

                            sintf: {
                                iid: target.attrs.iid,
                                itype: target.attrs.itype,
                                ipos: target.group,
                                iname: target.attrs.text.text
                            }
                        };
                    }
                });

                this.jointPaper.on('link:connect', (linkView) => {
                    if(linkView.sourceMagnet && linkView.targetMagnet) {
                        this.archDataAdaptor.addConnector(
                            sparent,
                            linkView.sourceView.model.attributes.cpid, 
                            linkView.sourceView.model.getPort(linkView.sourceMagnet.getAttribute('port')).attrs.iid,
                            linkView.targetView.model.attributes.cpid, 
                            linkView.targetView.model.getPort(linkView.targetMagnet.getAttribute('port')).attrs.iid,
                        ).save();

                        this.renderConfiguration(cid, cname);
                    } else EVENTBUS.$emit('ERROR_NULLCONNECTOR', cid, cname);
                });

                this.jointPaper.on('link:contextmenu', (linkView, evt) => {
                    this.showMenu('CFG_LINK', evt);
                    
                    this.selectedConnector = {
                        source: {
                            cpid: linkView.sourceView.model.attributes.cpid, 
                            iid: linkView.sourceView.model.getPort(linkView.sourceMagnet.getAttribute('port')).attrs.iid
                        },
                        target: {
                            cpid: linkView.targetView.model.attributes.cpid, 
                            iid: linkView.targetView.model.getPort(linkView.targetMagnet.getAttribute('port')).attrs.iid
                        },
                        cnlabel: linkView.model.attributes.labels,
                        sparent
                    }
                });
            }  
        },

        // Jump to configuration from the menu;
        jumpConfiguration(cid, cname) {
            let queue = [];
            let target;

            let traverse = function(item) {
                if(item.cid === cid && item.name === cname) target = item;
                else if(item.children) item.children.map(sitem => traverse(sitem));
            }

            let rpush = function(item) {
                if(item.parent) rpush(item.parent);
                queue.push({ cid: item.cid, cname: item.name });
            }

            this.treeViewItems[0].children.map(item => traverse(item));
            if(target) {
                rpush(target);
                this.archDataAdaptor.qclear();
                queue.map(i => this.archDataAdaptor.qpush(i));
            } else {
                let temp = this.archDataAdaptor.archQueue[0];
                this.archDataAdaptor.qclear().qpush(temp);
            }

            this.renderConfiguration(cid, cname);
        },

        // Add a new component in current configuration;
        addComponent() {
            this.componentDialog = false;

            this.archDataAdaptor.addComponent(this.selectedComponent, this.newComponentName).save();

            this.newComponentName = '';
            this.renderConfiguration(this.selectedComponent.sid, this.selectedComponent.sname);
        },

        // Add a new interface in selected component;
        addInterface() {
            this.interfaceDialog = false;

            if(this.selectedComponent.sintf) { // Edit exist interface;
                this.archDataAdaptor.updateComponent(
                    'eintf',
                    this.selectedComponent.sid,
                    this.selectedComponent.sname,
                    {
                        oldintf: this.selectedComponent.sintf,
                        itype: this.newInterfaceType,
                        ipos: this.newInterfacePos,
                        iname: this.newInterfaceName
                    }
                ).save();
            } else { // Add new interface;
                this.archDataAdaptor.updateComponent(
                    'aintf',
                    this.selectedComponent.sid,
                    this.selectedComponent.sname,
                    {
                        itype: this.newInterfaceType,
                        ipos: this.newInterfacePos,
                        iname: this.newInterfaceName
                    }
                ).save();
            }

            this.newInterfacePos = '';
            this.newInterfaceType = '';
            this.newInterfaceName = '';
            this.renderConfiguration(this.selectedComponent.sparent.cid, this.selectedComponent.sparent.cname);
        },

        // Deregister current component/connector evemts;
        deregisterConfiguration() {
            this.jointPaper.off('blank:contextmenu');
            this.jointPaper.off('element:pointerdblclick');
            this.jointPaper.off('element:pointerup');
            this.jointPaper.off('element:contextmenu');
            this.jointPaper.off('element:magnet:contextmenu');
            this.jointPaper.off('link:connect');

            this.selectedComponent = {};
            this.selectedConnector = {};
        }
    },

    watch: {
        '$route' () {
            this.setTopBar();
            this.renderViewModel();
        }
    },

    mounted() {
        this.setTopBar();

        this.jointGraph = new JOINT.dia.Graph;
        this.jointPaper = new JOINT.dia.Paper({
            el: this.$el.offsetParent,
            model: this.jointGraph,
            
            width: this.$el.offsetParent.clientWidth,
            height: this.$el.offsetParent.clientHeight,

            gridSize: 20,
            drawGrid: { name: 'mesh' },

            interactive: (cellView) => { return cellView.model.attributes.cpid !== 'INTERA'; }
        });
        setTimeout(() => { this.setViewModel(); }, 400);
        
        EVENTBUS.$on('FETCH_ARCHVIEWS', () => {
            setTimeout(() => {
                EVENTBUS.$emit('RETURN_ARCHVIEWS', this.archDataAdaptor.getViewpoints());
            }, 200);
        });

        EVENTBUS.$on('DELIVER_CREATEVIEW', (payload) => {
            this.archDataAdaptor.addViewpoint(payload).save();
            this.renderViewModel();
        });

        EVENTBUS.$on('DELIVER_REMOVEVIEW', (payload) => {
            this.archDataAdaptor.removeViewpoint(payload).save();
            this.renderViewModel();
        });

        EVENTBUS.$on('DELIVER_ENTERVIEW', (payload) => {
            this.jointGraph.clear();
            this.deregisterViewModel();
            this.archDataAdaptor.qclear();
            this.renderConfiguration(0, payload);
        });

        EVENTBUS.$on('DELIVER_GOOVERVIEW', () => {
            this.renderViewModel();
        });



        EVENTBUS.$on('ERROR_CONFIGNOTFOUND', (id, name) => {
            this.errorDialog = true;
            this.errorMessage = 'CONFIGURATION NOT FOUND';
            this.errorHint = 'Please retry.';

            this.renderConfiguration(id, name);
        });

        EVENTBUS.$on('ERROR_NULLCONNECTOR', (id, name) => {
            this.errorDialog = true;
            this.errorMessage = 'INVALID CONNECTOR SOURCE/TARGET';
            this.errorHint = 'Connector needs to be built between 2 interfaces.';

            this.renderConfiguration(id, name);
        });
    },

    beforeDestroy() {
        EVENTBUS.$off('FETCH_ARCHVIEWS');
        EVENTBUS.$off('DELIVER_CREATEVIEW');
        EVENTBUS.$off('DELIVER_REMOVEVIEW');
        EVENTBUS.$off('DELIVER_ENTERVIEW');
        EVENTBUS.$off('DELIVER_GOOVERVIEW');
        EVENTBUS.$off('ERROR_CONFIGNOTFOUND');
        EVENTBUS.$off('ERROR_NULLCONNECTOR');

        this.archDataAdaptor.save();
        location.reload();
    }
}
</script>