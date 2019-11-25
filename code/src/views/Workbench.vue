<template>
    <div>

    </div>
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
            AxiosRequest('get', `arch/${_this.title}`, null, (res) => {
                if(res.data) _this.archDataModifier = new ArchDataModifier(res.data);
            });
        },
        setWbModel() {
            let viewpoints = this.archDataModifier.getViewpoints().map((vp) => {
                return { 
                    key: vp 
                }
            });

            this.wbModel = this.$(GoJS.Model);
            this.wbModel.nodeDataArray = viewpoints;
            this.wbInstance.model = this.wbModel;
        }
    },

    watch: {
        '$route' () {
            this.setTopBar();
            setTimeout(() => {
                this.setWbModel();
                this.wbInstance.requestUpdate(); 
            }, 100);
            
        }
    },

    mounted() {
        let _this = this;

        this.setTopBar();

        this.$ = GoJS.GraphObject.make;
        this.wbInstance = this.$(GoJS.Diagram, this.$el.offsetParent, {});
        setTimeout(() => { this.setWbModel(); }, 100);
        
        EVENTBUS.$on('FETCH_ARCHVIEWS', function() {
            setTimeout(() => {
                EVENTBUS.$emit('RETURN_ARCHVIEWS', _this.archDataModifier.data.indices);
            }, 100);
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

        location.reload();
    }
}
</script>