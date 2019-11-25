<template>
</template>

<script>
import { EVENTBUS, AxiosRequest } from '../main.js';
import ArchDataModifier from '../ArchDataModifier.js';
import GoJS from 'gojs';

export default {
    data() {
        return {
            title: '',
            archDataModifier: {},

            $: null,
            wbInstance: null,
            wbModel: null
        }
    },

    methods: {
        setTopBar() {
            let _this = this;

            this.title = this.$route.params.name;
            AxiosRequest('get', `arch/${_this.title}`, null, function(res) {
                if(res.data) _this.archDataModifier = new ArchDataModifier(res.data);
            });
        },
        setWbModel() {
            this.wbModel = this.$(GoJS.Model);

            this.wbModel.nodeDataArray = [
                { key: "Alpha" },
                { key: "Beta" },
                { key: this.title }
            ];
            this.wbInstance.model = this.wbModel;
        }
    },

    watch: {
        '$route' () {
            this.setTopBar();
            this.setWbModel();
            this.wbInstance.requestUpdate();
        }
    },

    mounted() {
        let _this = this;
        
        this.setTopBar();

        this.$ = GoJS.GraphObject.make;
        this.wbInstance = this.$(GoJS.Diagram, this.$el.offsetParent, {});
        this.setWbModel();
        
        EVENTBUS.$on('FETCH_ARCHVIEWS', function() {
            setTimeout(() => {
                EVENTBUS.$emit('RETURN_ARCHVIEWS', _this.archDataModifier.data.indices);
            }, 500);
        });

        EVENTBUS.$on('DELIVER_CREATEVIEW', function(payload) {
            _this.archDataModifier.addViewpoint(payload).save();
        });

        EVENTBUS.$on('DELIVER_REMOVEVIEW', function(payload) {
            _this.archDataModifier.deleteViewpoint(payload).save();
        })
    },

    beforeDestroy() {
        EVENTBUS.$off('FETCH_ARCHVIEWS');
        EVENTBUS.$off('DELIVER_CREATEVIEW');
        EVENTBUS.$off('DELIVER_REMOVEVIEW');
    }
}
</script>