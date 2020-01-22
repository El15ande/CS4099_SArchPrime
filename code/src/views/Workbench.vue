<template>
    <div>
        <v-menu
            v-model='jointMenu'
            absolute
            :position-x='menuX'
            :position-y='menuY'
        >
            <v-list>
                <v-list-item 
                    v-for='(item, i) in menu'
                    :key='i'
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
            v-model="labelDialog"
            width='500'
        >
            <v-card>
                <v-card-title>{{ labelDialogTitle }}</v-card-title>
                <v-card-actions>
                    <v-text-field
                        v-model="labelInput"
                        outlined
                        :rules="['Required']"
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
    </div>
</template>

<style>
    @import '../../node_modules/jointjs/dist/joint.css';

    .v-content__wrap {
        border: 1px solid #CFD8DC;
    }
</style>

<script>
import { EVENTBUS, AxiosRequest } from '../main.js';
import ArchDataAdapator from '../ArchDataAdapator.js';
import ArchGraphComponent from '../ArchGraphComponent.js';
import $ from 'jquery';
import * as JOINT from 'jointjs';

export default {
    data() {
        return {
            title: '',
            archDataAdapator: {},

            jointGraph: null,
            jointPaper: null,

            // Click menu;
            jointMenu: false,
            menuContext: '',
            menuX: 0,
            menuY: 0,

            // Viewpoint cache;
            selectedView: {},
            
            // Connection cache;
            selectedLink: {},

            // Connection label cache;
            selectedLinkModel: null,
            labelDialog: false,
            labelDialogTitle: '',
            labelInput: '',
        }
    },

    computed: {
        menu() {
            let _this = this;

            switch (this.menuContext) {
                case 'VM_ELEMENT':
                    return [
                        {
                            name: 'New View Connection',
                            description: 'Create a new connection between views',
                            action: function() {
                                _this.jointMenu = false;
                                _this.archDataAdapator.addConnection(
                                    _this.selectedView.sid, 
                                    _this.selectedView.spos
                                ).save();
                                _this.renderViewModel();
                            }
                        }
                    ];

                case 'VM_LINK':
                    let removeConnection = 
                        {
                            name:'Remove Connection',
                            description: 'Remove this connection',
                            action: function() {
                                _this.jointMenu = false;
                                _this.archDataAdapator.deleteConnection(
                                    _this.selectedLink.lsource, 
                                    _this.selectedLink.ltarget
                                ).save();
                                _this.renderViewModel();
                            }
                        };

                    let addLabel = 
                        {
                            name: 'Add Label',
                            description: 'Add label to this connection',
                            action: function() {
                                _this.jointMenu = false;
                                _this.labelDialog = true;
                                _this.labelDialogTitle = 'Add Label'
                            }
                        };
                    
                    let editLabel = 
                        {
                            name: 'Edit Label',
                            description: 'Edit label',
                            action: function() {
                                _this.jointMenu = false;
                                _this.labelDialog = true;
                                _this.labelDialogTitle = 'Edit Label'
                                _this.labelInput = _this.selectedLink.llabel[0].attrs.text.text;
                            }
                        };
                    
                    let removeLabel =
                        {
                            name: 'Remove Label',
                            description: 'Remove label from this connection',
                            action: function() {
                                _this.jointMenu = false;
                                _this.removeConnectionLabel();
                            }
                        };

                    let menu = _this.selectedLink.llabel.length > 0
                        ? [removeConnection, editLabel, removeLabel]
                        : [removeConnection, addLabel];

                    return menu;
                case 'VM_BLANK':
                    return [
                        {
                            name: 'New View',
                            description: 'Create a new view',
                            action: function() {
                                _this.jointMenu = false;
                                EVENTBUS.$emit('INVOKE_CREATEVIEW');
                            }
                        }
                    ];
                
                default: return []; 
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

        // Refresh workbench;
        renderViewModel() {
            setTimeout(() => {
                this.jointGraph.clear();
                this.setViewModel();
            }, 400);
        },
        


        // View model: top level view, consisting of viewpoints (top-level component) & connections (top-level connector);
        setViewModel() {
            let viewpoints = this.archDataAdapator.getViewpoints();
            let connections = this.archDataAdapator.getConnections();
            let viewpoint, vpshape, conshape;

            sessionStorage.setItem('canvasWidth', $('.v-content__wrap').width());
            sessionStorage.setItem('canvasHeight', $('.v-content__wrap').height());

            viewpoints.map((vp) => {
                viewpoint = this.archDataAdapator.getViewpoint(vp);
                vpshape = new JOINT.shapes.standard.Rectangle();

                vpshape.position(viewpoint.canvas.x, viewpoint.canvas.y);
                vpshape.resize(viewpoint.canvas.width, viewpoint.canvas.height);
                vpshape.attr({
                    label: { 
                        text: vp,
                        'font-size': (viewpoint.canvas.width * viewpoint.canvas.height) / 1200
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
                this.selectedLink = {
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
                            this.selectedLink,
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
                            this.selectedLink,
                            {
                                newSource: linkView.sourceView
                                    ? linkView.sourceView.model.vpid
                                    : linkView.sourcePoint,
                                newTarget: nearbyElements[0].vpid
                            }
                        ).save();
                    }
                } else {
                    console.log(linkView.source);

                    this.archDataAdapator.updateConnection(
                        'link',
                        this.selectedLink,
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
            this.jointPaper.on('element:pointerdblclick', (elementView, evt) => {
                let vpname = elementView.model.attr().label.text;

                EVENTBUS.$emit('INVOKE_ENTERVIEW', vpname);
                this.deregisterViewModel();
                this.renderConfiguration(vpname);
            });

            // Cell (viewpoint): right click;
            this.jointPaper.on('element:contextmenu', (elementView, evt) => {
                this.jointMenu = true;
                this.menuContext = 'VM_ELEMENT';
                this.selectedView = {
                    sid: elementView.model.vpid,
                    spos: {
                        x: elementView.model.attributes.position.x + elementView.model.attributes.size.width / 2,
                        y: elementView.model.attributes.position.y + elementView.model.attributes.size.height + 40
                    }
                };

                this.setMenuCoordinate(evt);
            });

            // Link (connection): right click;
            this.jointPaper.on('link:contextmenu', (linkView, evt) => {
                this.jointMenu = true;
                this.menuContext = 'VM_LINK';
                this.selectedLink = {
                    lsource: linkView.sourceView 
                        ? linkView.sourceView.model.vpid
                        : linkView.sourcePoint,
                    ltarget: linkView.targetView
                        ? linkView.targetView.model.vpid
                        : linkView.targetPoint,
                    llabel: linkView.model.attributes.labels
                };
                this.selectedLinkModel = linkView.model;

                this.setMenuCoordinate(evt);
            });

            // Blank space: right click;
            this.jointPaper.on('blank:contextmenu', (evt) => {
                this.jointMenu = true;
                this.menuContext = 'VM_BLANK';
                this.selectedView.spos = {
                    x: evt.offsetX,
                    y: evt.offsetY
                }
                this.setMenuCoordinate(evt);
            });
        },
        
        // Add link (connection) label;
        addConnectionLabel() {
            this.labelDialog = false;

            this.selectedLinkModel.appendLabel({ 
                attrs: { text: { text: this.labelInput } } 
            });

            this.archDataAdapator.updateConnection(
                'alabel',
                this.selectedLink,
                this.labelInput
            ).save();

            this.labelInput = '';
            this.renderViewModel();
        },

        // Remove link (connection) label;
        removeConnectionLabel() {
            this.archDataAdapator.updateConnection(
                'rlabel',
                this.selectedLink
            ).save();

            this.renderViewModel();
        },

        deregisterViewModel() {
            this.jointPaper.off('element:pointerup');
            this.jointPaper.off('link:pointerdown');
            this.jointPaper.off('link:pointerup');
            this.jointPaper.off('element:pointerdblclick');
            this.jointPaper.off('element:contextmenu');
            this.jointPaper.off('link:contextmenu');
            this.jointPaper.off('blank:contextmenu');
        },

        renderConfiguration(cname) {
            let x = this.archDataAdapator.makeComponent();
            x.cpname = 'waht';

            var shapey = new ArchGraphComponent(x);
            shapey.addTo(this.jointGraph);
        },
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
            _this.renderConfiguration(payload);
        });

        EVENTBUS.$on('DELIVER_GOOVERVIEW', function() {
            _this.renderViewModel();
        });
    },

    beforeDestroy() {
        EVENTBUS.$off('FETCH_ARCHVIEWS');
        EVENTBUS.$off('DELIVER_CREATEVIEW');
        EVENTBUS.$off('DELIVER_REMOVEVIEW');
        EVENTBUS.$off('DELIVER_ENTERVIEW');

        this.archDataAdapator.save();
        location.reload();
    }
}
</script>