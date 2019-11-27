<template>
    <div />
</template>

<script>
import { EVENTBUS, AxiosRequest } from '../main.js';
import ArchDataModifier from '../ArchDataModifier.js';
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
            }, 100);
        },
        
        setViewpoints() {
            let viewpoints = this.archDataModifier.getViewpoints();
            let viewpoint;

            viewpoints.map((vp) => {
                viewpoint = new JOINT.shapes.standard.Rectangle();
                viewpoint.resize(200, 100);
                viewpoint.attr({
                    label: {
                        text: vp
                    }
                });
                viewpoint.addTo(this.jointGraph);
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
        setTimeout(() => {
            this.setViewpoints()
        }, 100);
        
        EVENTBUS.$on('FETCH_ARCHVIEWS', function() {
            setTimeout(() => {
                EVENTBUS.$emit('RETURN_ARCHVIEWS', _this.archDataModifier.data.indices);
            }, 100);
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