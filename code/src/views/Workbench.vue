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
import ArchDataModifier from '../ArchDataModifier.js';
import $ from 'jquery';
import * as JOINT from 'jointjs';

export default {
    data() {
        return {
            title: '',
            archDataModifier: {},

            jointGraph: null,
            jointPaper: null,

            jointMenu: false,
            menuContext: '',
            menuX: 0,
            menuY: 0,

            selectedView: {},
            selectedLink: {}
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
                                _this.archDataModifier.addViewpointConnection(_this.selectedView.sid, _this.selectedView.spos).save();
                                _this.renderViewModel();
                            }
                        }
                    ];

                case 'VM_LINK':
                    return [
                        {
                            name:'Remove Connection',
                            description: 'Remove this connection',
                            action: function() {
                                _this.jointMenu = false;
                                _this.archDataModifier.deleteViewpointConnection(_this.selectedLink.lsource, _this.selectedLink.ltarget).save();
                                _this.renderViewModel();
                            }
                        }
                    ];
                
                case 'VM_BLANK':
                    return [
                        {
                            name: 'New View',
                            description: 'Create a new view',
                            action: function() {
                                EVENTBUS.$emit('INVOKE_CREATEVIEW');
                            }
                        },

                        {
                            name: 'New View Connection',
                            description: 'Create a new arbitrary view connection',
                            action: function() {
                                
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

        setTopBar() {
            let _this = this;

            this.title = this.$route.params.name;
            AxiosRequest('get', `arch/${_this.title}`, null, (res) => {
                if(res.data) _this.archDataModifier = new ArchDataModifier(res.data);
            });
        },

        setMenuCoordinate(e) {
            this.menuX = e.originalEvent.clientX;
            this.menuY = e.originalEvent.clientY;
        },

        renderViewModel() {
            setTimeout(() => {
                this.jointGraph.clear();
                this.setViewModel();
            }, 200);
        },
        
        setViewModel() {
            let viewpoints = this.archDataModifier.getViewModel();
            let viewpointConnections = this.archDataModifier.getViewpointConnections();
            let viewpoint, vpshape, conshape;

            sessionStorage.setItem('canvasWidth', $('.v-content__wrap').width());
            sessionStorage.setItem('canvasHeight', $('.v-content__wrap').height());

            viewpoints.map((vp) => {
                viewpoint = this.archDataModifier.getViewpoint(vp);
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

            viewpointConnections.map((c) => {
                conshape = new JOINT.shapes.standard.Link();
                (typeof c.source === 'string')
                    ? conshape.source(this.getCell(c.source))
                    : conshape.source({
                        x: c.source.x,
                        y: c.source.y
                    });
                (typeof c.target === 'string')
                    ? conshape.target(this.getCell(c.source))
                    : conshape.target({
                        x: c.target.x,
                        y: c.target.y
                    });

                conshape.addTo(this.jointGraph);
            });

            // Cell: drag & drop;
            this.jointPaper.on('element:pointerup', (elementView) => {
                this.archDataModifier.updateViewpoint(
                    'position',
                    elementView.model.attr().label.text, 
                    elementView.model.attributes.position
                ).save();
            });

            // Cell: left double click;
            this.jointPaper.on('element:pointerdblclick', (elementView, evt) => {
                let vpname = elementView.model.attr().label.text;

                EVENTBUS.$emit('INVOKE_ENTERVIEW', vpname);
                this.renderViewpoint(vpname);
            });

            // Cell: right click;
            this.jointPaper.on('element:contextmenu', (elementView, evt) => {
                console.log(elementView);

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

            this.jointPaper.on('link:contextmenu', (linkView, evt) => {
                console.log(linkView);

                this.jointMenu = true;
                this.menuContext = 'VM_LINK';
                this.selectedLink = {
                    lsource: linkView.sourceView 
                        ? linkView.sourceView.model.cid
                        : linkView.sourcePoint,
                    ltarget: linkView.targetView
                        ? linkView.targetView.model.cid
                        : linkView.targetPoint
                }

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

        renderViewpoint(vpname) {
            let vpdata = this.archDataModifier.getViewpoint(vpname);

            console.log(vpdata);
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
                EVENTBUS.$emit('RETURN_ARCHVIEWS', _this.archDataModifier.getViewModel());
            }, 200);
        });

        EVENTBUS.$on('DELIVER_CREATEVIEW', function(payload) {
            _this.archDataModifier.addViewpoint(payload).save();
            _this.renderViewModel();
        });

        EVENTBUS.$on('DELIVER_REMOVEVIEW', function(payload) {
            _this.archDataModifier.deleteViewpoint(payload).save();
            _this.renderViewModel();
        });

        EVENTBUS.$on('DELIVER_ENTERVIEW', function(payload) {
            _this.jointGraph.clear();
            _this.renderViewpoint(payload);
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

        this.archDataModifier.save();

        location.reload();
    }
}
</script>