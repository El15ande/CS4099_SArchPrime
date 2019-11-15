<template>
    <v-container fluid grid-list-md>
        <v-layout row wrap>
                <v-flex ref="toolbox" d-flex md1 style="border: 1px solid #CFD8DC">
                    <wb-toolbox />
                </v-flex>

                <v-flex ref="canvas" d-flex md10 style="border: 1px solid #CFD8DC">
                    <wb-canvas />
                </v-flex>

                <v-flex ref="list" d-flex md1 style="border: 1px solid #CFD8DC">
                    <wb-list />
                </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { EVENTBUS, AxiosRequest } from '../main.js';
import ArchDataModifier from '../ArchDataModifier.js';

export default {
    components: {
        WbToolbox: () => import('./WbToolbox'),
        WbCanvas: () => import('./WbCanvas'),
        WbList: () => import('./WbList')
    },

    data() {
        return {
            title: '',
            archDataModifier: {}
        }
    },

    mounted() {
        let _this = this;
        this.title = this.$route.params.name;

        AxiosRequest('get', `arch/${_this.title}`, null, function(res) {
            if(res.data) _this.archDataModifier = new ArchDataModifier(res.data);
        });

        EVENTBUS.$on('FETCH_ARCHVIEWS', function() {
            setTimeout(() => {
                EVENTBUS.$emit('RETURN_ARCHVIEWS', _this.archDataModifier.data.indices);
            }, 500);
        });
    },

    beforeDestroy() {
        EVENTBUS.$off('FETCH_ARCHVIEWS');
    }
}
</script>