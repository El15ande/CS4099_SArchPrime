<template>
    <div>
        <v-menu
            v-model="jointMenu"
            absolute
            :position-x="menuX"
            :position-y="menuY"
        >
            <v-list
                max-width='300'
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
                <v-card-title>Error</v-card-title>
                <v-card-text>
                    <div>Code: {{ errorMessage }}.</div>
                    <div>Please retry.</div>
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
                        @click='addConnectionLabel()'
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
                    <v-col md='6'>
                        <v-text-field
                            v-model="customiseWidth"
                            outlined
                            label="Current width (block)" 
                        />
                    </v-col>

                    <v-col md='6'>
                        <v-text-field
                            v-model="customiseHeight"
                            outlined
                            label="Current height (block)" 
                        />
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
</style>

<script>
import { EVENTBUS, AxiosRequest } from '../main.js';
import ArchDataAdapator from '../ArchDataAdapator.js';
import ArchGraphComponent from '../ArchGraphComponent.js';
import ArchGraphInterface from '../ArchGraphInterface.js';
import $ from 'jquery';
import * as JOINT from 'jointjs';

export default {
    data() {
        return {
            title: '',
            archDataAdapator: {},

            jointGraph: null,
            jointPaper: null,

            // Error dialog;
            errorDialog: false,
            errorMessage: 'error',

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
            selectedConnectorModel: null,
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
            interfaceTypes: ['Input', 'Output'],
            newInterfacePos: '',
            newInterfaceType: '',
            newInterfaceName: ''
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
                            description: 'Create a new connection between views',
                            colourclass: ['bg_create'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.archDataAdapator.addConnection(
                                    _this.selectedComponent
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
                            }
                        }
                    ];
                }
                case 'VM_LINK': {
                    let addLabel = 
                        {
                            name: 'Add Label',
                            description: 'Add label to this connection',
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
                            description: 'Edit label',
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
                            description: 'Remove label from this connection',
                            colourclass: ['bg_delete'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.removeConnectionLabel();
                            }
                        };
                    
                    let removeConnection = 
                        {
                            name:'Remove Connection',
                            description: 'Remove this connection',
                            colourclass: ['bg_delete'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.archDataAdapator.deleteConnection(
                                    _this.selectedConnector.lsource, 
                                    _this.selectedConnector.ltarget
                                ).save();
                                _this.renderViewModel();
                            }
                        };

                    console.log(_this.selectedConnector);

                    let menu = _this.selectedConnector.llabel.length > 0
                        ? [removeLabel, removeConnection, editLabel]
                        : [addLabel, removeConnection];

                    return menu;
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
                            description: 'Add a new interface to this component',
                            colourclass: ['bg_create'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.interfaceDialogTitle = 'Create new interface';
                                _this.interfaceDialog = true;
                            }
                        },

                        {
                            name: 'Remove component',
                            description: 'Remove this component',
                            colourclass: ['bg_delete'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.archDataAdapator.deleteComponent(
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
                            }
                        }
                    ];
                }
                case 'CFG_PORT': {
                    return [
                        {
                            name: 'Remove interface',
                            description: 'Remove this interface',
                            colourclass: ['bg_delete'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.archDataAdapator.updateComponent(
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
                case 'CFG_LINK': {
                    return [];
                }
                case 'CFG_BLANK': {
                    return [
                        {
                            name: 'Back',
                            description: 'Return back to previous level',
                            colourclass: ['bg_hierarchy'],
                            action: function() {
                                _this.jointMenu = false;
                                
                                if(_this.selectedComponent.sid === 0) {
                                    EVENTBUS.$emit('INVOKE_ENTERVIEW', null);
                                    _this.renderViewModel();
                                } else {
                                    _this.archDataAdapator.qpop();
                                    let parent = _this.archDataAdapator.qlast();
                                    _this.renderConfiguration(parent.cid, parent.cname);
                                }
                            }
                        },

                        {
                            name: 'New component',
                            description: 'Create a new component',
                            colourclass: ['bg_create'],
                            action: function() {
                                _this.jointMenu = false;
                                _this.componentDialog = true;
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
                if(res.data) _this.archDataAdapator = new ArchDataAdapator(res.data);
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
            let viewpoints = this.archDataAdapator.getViewpoints();
            let connections = this.archDataAdapator.getConnections();
            let viewpoint, vpshape, conshape;

            sessionStorage.setItem('canvasWidth', $('.v-content__wrap').width());
            sessionStorage.setItem('canvasHeight', $('.v-content__wrap').height());
            this.archDataAdapator.qclear();

            viewpoints.map((vp) => {
                viewpoint = this.archDataAdapator.getViewpoint(vp);

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

                /*vpshape = new JOINT.shapes.standard.Rectangle({
                    vpid: vp,
                    attrs: {
                        label: { 
                            text: vp,
                            'font-size': 20
                        }
                    },
                    position: {
                        x: viewpoint.canvas.x,
                        y: viewpoint.canvas.y
                    },
                    size: {
                        width: viewpoint.canvas.width,
                        height: viewpoint.canvas.height
                    }
                });*/
                
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
                if(c.labels) {
                    let labelArr = c.labels.map((l) => {
                        return {
                            attrs: { text: { text: l } }
                        };
                    });
                    conshape.labels(labelArr);
                }

                conshape.addTo(this.jointGraph);
            });

            // Cell (viewpoint): drag & drop;
            this.jointPaper.on('element:pointerup', (elementView) => {
                this.archDataAdapator.updateViewpoint(
                    'position',
                    elementView.model.attr().label.text, 
                    elementView.model.attributes.position
                ).save();
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
                        this.archDataAdapator.updateConnection(
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
                        this.archDataAdapator.updateConnection(
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
                    this.archDataAdapator.updateConnection(
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
                this.selectedConnectorModel = linkView.model;
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
        
        // Add link (connection) label;
        addConnectionLabel() {
            this.labelDialog = false;

            this.selectedConnectorModel.appendLabel({ 
                attrs: { text: { text: this.labelInput } } 
            });

            this.archDataAdapator.updateConnection(
                'alabel',
                this.selectedConnector,
                this.labelInput
            ).save();

            this.labelInput = '';
            this.renderViewModel();
        },

        // Remove link (connection) label;
        removeConnectionLabel() {
            this.archDataAdapator.updateConnection(
                'rlabel',
                this.selectedConnector
            ).save();

            this.renderViewModel();
        },

        // Customise component style;
        customise() {
            this.customiseDialog = false;

            if(this.menuContext === 'VM_ELEMENT') {
                this.archDataAdapator.updateViewpoint(
                    'size',
                    this.selectedComponent.sid,
                    {
                        width: Math.ceil(this.customiseWidth) * 20,
                        height: Math.ceil(this.customiseHeight) * 20
                    }
                ).save();

                this.renderViewModel();
            } else if(this.menuContext === 'CFG_ELEMENT') {
                this.archDataAdapator.updateComponent(
                    'size',
                    this.selectedComponent.sid,
                    this.selectedComponent.sname,
                    {
                        width: Math.ceil(this.customiseWidth) * 20,
                        height: Math.ceil(this.customiseHeight) * 20
                    }
                ).save();

                this.renderConfiguration(this.selectedComponent.sparent.cid, this.selectedComponent.sparent.cname);
            }
        },

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
            let configuration = this.archDataAdapator.getConfiguration(cid, cname);
            let componentShape, connectorShape;

            if(configuration) {
                this.jointGraph.clear();
                this.deregisterConfiguration();
                this.archDataAdapator.qpush({ cid, cname });

                configuration.component.map((data) => {
                    componentShape = new ArchGraphComponent(data);

                    componentShape.addTo(this.jointGraph);
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
                    this.renderConfiguration(elementView.model.attributes.cpid, elementView.model.attr().label.text);
                });

                // Component: drag & drop;
                this.jointPaper.on('element:pointerup', (elementView) => {
                    this.archDataAdapator.updateComponent(
                        'position',
                        elementView.model.attributes.cpid,
                        elementView.model.attr().label.text,
                        elementView.model.attributes.position
                    ).save();
                });

                // Component: right click;
                this.jointPaper.on('element:contextmenu', (elementView, evt) => {
                    this.showMenu('CFG_ELEMENT', evt);
                    this.selectedComponent = {
                        sid: elementView.model.attributes.cpid,
                        sname: elementView.model.attr().label.text,
                        spos: {
                            x: evt.offsetX,
                            y: evt.offsetY
                        },
                        ssize: elementView.model.attributes.size,
                        sparent: { cid, cname }
                    };
                });

                this.jointPaper.on('element:magnet:contextmenu', (elementView, evt, magnet) => {
                    let target = elementView.model.getPort(magnet.getAttribute('port'));
                    evt.stopPropagation();

                    this.showMenu('CFG_PORT', evt);
                    this.selectedComponent = {
                        sid: elementView.model.attributes.cpid,
                        sname: elementView.model.attr().label.text,
                        spos: {
                            x: evt.offsetX,
                            y: evt.offsetY
                        },
                        ssize: elementView.model.attributes.size,
                        sparent: { cid, cname },

                        sintf: {
                            iid: target.attrs.iid,
                            itype: target.attrs.itype,
                            ipos: target.group,
                            iname: target.attrs.text.text
                        }
                    };
                });

                this.jointPaper.on('link:connect', (linkView, evt) => {
                    console.log('link:connect', linkView);
                });

                this.jointPaper.on('link:disconnect', (linkView, evt) => {
                    console.log('disconnect', linkView);
                });
            }  
        },

        addComponent() {
            this.componentDialog = false;

            this.archDataAdapator.addComponent(this.selectedComponent, this.newComponentName).save();
            this.renderConfiguration(this.selectedComponent.sid, this.selectedComponent.sname);
        },

        addInterface() {
            this.interfaceDialog = false;

            if(this.selectedComponent.sintf) { // Edit exist interface;
                this.archDataAdapator.updateComponent(
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
                this.archDataAdapator.updateComponent(
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

        deregisterConfiguration() {
            this.jointPaper.off('blank:contextmenu');
            this.jointPaper.off('element:pointerdblclick');
            this.jointPaper.off('element:pointerup');
        }
    },

    watch: {
        '$route' () {
            this.setTopBar();
            this.renderViewModel();
        }
    },

    mounted() {
        let _this = this;

        this.setTopBar();

        this.jointGraph = new JOINT.dia.Graph;
        this.jointPaper = new JOINT.dia.Paper({
            el: this.$el.offsetParent,
            model: this.jointGraph,
            
            width: this.$el.offsetParent.clientWidth,
            height: this.$el.offsetParent.clientHeight,

            gridSize: 20,
            drawGrid: { name: 'mesh' }
        });
        setTimeout(() => { this.setViewModel(); }, 400);
        
        EVENTBUS.$on('FETCH_ARCHVIEWS', function() {
            setTimeout(() => {
                EVENTBUS.$emit('RETURN_ARCHVIEWS', _this.archDataAdapator.getViewpoints());
            }, 200);
        });

        EVENTBUS.$on('DELIVER_CREATEVIEW', function(payload) {
            _this.archDataAdapator.addViewpoint(payload).save();
            _this.renderViewModel();
        });

        EVENTBUS.$on('DELIVER_REMOVEVIEW', function(payload) {
            _this.archDataAdapator.deleteViewpoint(payload).save();
            _this.renderViewModel();
        });

        EVENTBUS.$on('DELIVER_ENTERVIEW', function(payload) {
            _this.jointGraph.clear();
            _this.deregisterViewModel();
            _this.renderConfiguration(0, payload);
        });

        EVENTBUS.$on('DELIVER_GOOVERVIEW', function() {
            _this.renderViewModel();
        });



        EVENTBUS.$on('ERROR_CONFIGNOTFOUND', function(id, name) {
            _this.errorDialog = true;
            _this.errorMessage = 'Configuration not found';

            _this.jointGraph.clear();
            _this.renderConfiguration(id, name);
        });
    },

    beforeDestroy() {
        EVENTBUS.$off('FETCH_ARCHVIEWS');
        EVENTBUS.$off('DELIVER_CREATEVIEW');
        EVENTBUS.$off('DELIVER_REMOVEVIEW');
        EVENTBUS.$off('DELIVER_ENTERVIEW');
        EVENTBUS.$off('DELIVER_GOOVERVIEW');
        EVENTBUS.$off('ERROR_CONFIGNOTFOUND');

        this.archDataAdapator.save();
        location.reload();
    }
}
</script>