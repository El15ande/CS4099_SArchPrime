<template>
    <div />
</template>

<style>
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

        render() {
            setTimeout(() => {
                this.jointGraph.clear();
                this.setViewpoints();
            }, 200);
        },
        
        setViewpoints() {
            let viewpoints = this.archDataModifier.getViewpoints();
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
                        'font-size': (viewpoint.canvas.width * viewpoint.canvas.height) / 1000
                    }
                });

                vpshape.addTo(this.jointGraph);
            });

            this.jointPaper.on('element:pointerup', (cellView) => {
                this.archDataModifier.updateViewpoint(
                    'position',
                    cellView.model.attr().label.text, 
                    cellView.model.attributes.position
                ).save();
            });
        }
    },

    watch: {
        '$route' () {
            this.setTopBar();
            this.render();
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
            height: this.$el.offsetParent.clientHeight
        });
        setTimeout(() => { this.setViewpoints(); }, 200);
        
        EVENTBUS.$on('FETCH_ARCHVIEWS', function() {
            setTimeout(() => {
                EVENTBUS.$emit('RETURN_ARCHVIEWS', _this.archDataModifier.getViewpoints());
            }, 200);
        });

        EVENTBUS.$on('DELIVER_CREATEVIEW', function(payload) {
            _this.archDataModifier.addViewpoint(payload).save();
            _this.render();
        });

        EVENTBUS.$on('DELIVER_REMOVEVIEW', function(payload) {
            _this.archDataModifier.deleteViewpoint(payload).save();
            _this.render();
        });
    },

    beforeDestroy() {
        EVENTBUS.$off('FETCH_ARCHVIEWS');
        EVENTBUS.$off('DELIVER_CREATEVIEW');
        EVENTBUS.$off('DELIVER_REMOVEVIEW');

        location.reload();
    }
}
</script>