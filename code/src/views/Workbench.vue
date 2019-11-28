<template>
    <div>
        <v-menu
            v-model='jointContextMenu'
            absolute
            :position-x='menuX'
            :position-y='menuY'
        >
            <v-list>
                <v-list-item>
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

            jointContextMenu: false,
            menuX: 0,
            menuY: 0,
        }
    },

    methods: {
        setTopBar() {
            let _this = this;

            this.title = this.$route.params.name;
            AxiosRequest('get', `arch/${_this.title}`, null, (res) => {
                if(res.data) _this.archDataModifier = new ArchDataModifier(res.data);
            });
        },

        renderViewModel() {
            setTimeout(() => {
                this.jointGraph.clear();
                this.setViewModel();
            }, 200);
        },
        
        setViewModel() {
            let viewpoints = this.archDataModifier.getViewModel();
            let viewpoint, vpshape;

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

                vpshape.addTo(this.jointGraph);
            });

            // Viewpoint drag & drop;
            this.jointPaper.on('cell:pointerup', (cellView) => {
                this.archDataModifier.updateViewpoint(
                    'position',
                    cellView.model.attr().label.text, 
                    cellView.model.attributes.position
                ).save();
            });

            this.jointPaper.on('cell:pointerclick', (cellView) => {
            });

            // Blank context menu call out (right click);
            this.jointPaper.on('blank:contextmenu', (evt) => {
                this.jointContextMenu = true;
                this.menuX = evt.originalEvent.clientX;
                this.menuY = evt.originalEvent.clientY;
            });
        },

        renderViewpoint(vpname) {
            let vpdata = this.archDataModifier.getViewpoint(vpname);
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

        location.reload();
    }
}
</script>