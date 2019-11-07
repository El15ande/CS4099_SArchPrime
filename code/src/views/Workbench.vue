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
import AXIOS from 'axios';
const REMOTEHOST = 'https://yw69.host.cs.st-andrews.ac.uk/node';
const LOCALHOST = 'http://localhost:20804/';

export default {
    components: {
        WbToolbox: () => import('./WbToolbox'),
        WbCanvas: () => import('./WbCanvas'),
    },

    data() {
        return {
            title: '',
            archData: {}
        }
    },

    mounted() {
        let _this = this;
        this.title = this.$route.params.name;

        AXIOS({
            method: 'get',
            url: `${REMOTEHOST}arch/${_this.title}`,
            crossDomain: true,
        }).then((res) => {
            if(res.data.err) alert(`Cannot read file ${res.data.err.path}`);

            if(res.data) {
                _this.archData = res.data;
            }
        });
    }
}
</script>