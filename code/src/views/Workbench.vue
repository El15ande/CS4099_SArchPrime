<template>

</template>

<script>
import { EVENTBUS, AxiosRequest } from '../main.js';
import ArchDataModifier from '../ArchDataModifier.js';

export default {
    data() {
        return {
            title: '',
            archDataModifier: {}
        }
    },

    methods: {
        setTopBar() {
            let _this = this;

            this.title = this.$route.params.name;

            AxiosRequest('get', `arch/${_this.title}`, null, function(res) {
                if(res.data) _this.archDataModifier = new ArchDataModifier(res.data);
            });
        }
    },

    watch: {
        '$route': 'setTopBar'
    },

    mounted() {
        let _this = this;
        
        this.setTopBar();

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
        EVENTBUS.$off('DELIVER_NEWVIEW');
    }
}
</script>