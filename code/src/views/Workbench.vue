<template>
    <v-container fluid grid-list-md>
        <v-layout row wrap>
                <v-flex ref="toolbox" d-flex md2 style="border: 1px solid #CFD8DC">
                    <wb-toolbox />
                </v-flex>

                <v-flex ref="canvas" d-flex md10 style="border: 1px solid #CFD8DC">
                    <wb-canvas />
                </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { AxiosRequest } from '../main.js';
import ArchDataModifier from '../ArchDataModifier.js';

export default {
    components: {
        WbToolbox: () => import('./WbToolbox'),
        WbCanvas: () => import('./WbCanvas'),
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

        AxiosRequest('get', `arch/${_this.title}`, function(res) {
            if(res.data) _this.archDataModifier = new ArchDataModifier(res.data);
        });
    }
}
</script>