<template>
    <v-app-bar 
    app
    absolute
    flat
    color="transparent"
    >
        <v-toolbar-title>
            {{ title }}
        </v-toolbar-title>

        <v-col 
            sm="2"
            v-if="inWorkbench"
        >
            <v-select
                style="margin-top: 32px;"
                label="views"
                :items="archViews"
                dense
                outlined
            />
        </v-col>
    </v-app-bar>
</template>

<script>
import { EVENTBUS } from '../main.js';

export default {
    data() {
        return {
            title: this.$route.params.name || this.$route.name,
            inWorkbench: false,
            archViews: []
        }
    },

    watch: {
        '$route' (val) {
            this.title = val.params.name || val.name;

            if(val.name === 'Workbench') {
                this.inWorkbench = true;
                setTimeout(() => {
                    EVENTBUS.$emit('FETCH_ARCHVIEWS');
                }, 500);
            } else this.inWorkbench = false;
        }
    },

    mounted() {
        let _this = this;
        
        sessionStorage.setItem('topbarHeight', this.$el.offsetHeight);

        if(this.$route.name === 'Workbench') {
            this.inWorkbench = true;
            EVENTBUS.$emit('FETCH_ARCHVIEWS');
        }

        EVENTBUS.$on('RETURN_ARCHVIEWS', function(payload) {
            _this.archViews = payload;
        });
    },

    beforeDestroy() {
        EVENTBUS.$off('RETURN_ARCHVIEWS');
    }
}
</script>