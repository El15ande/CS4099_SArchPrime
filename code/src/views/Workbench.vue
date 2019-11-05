<template>
    <v-stage 
        :config='konvaConfig'
        style="background: #ffffff; border: 1px solid #CFD8DC"
    >

        <v-layer ref='toolbox'>
            <v-rect
                :config='toolboxConfig'
            />
        </v-layer>
    </v-stage>
</template>

<script>
import AXIOS from 'axios';
const REMOTEHOST = 'https://yw69.host.cs.st-andrews.ac.uk/node';
const LOCALHOST = 'http://localhost:20804/';

export default {
    data() {
        return {
            title: '',
            archData: {},

            konvaConfig: {
                width: 0,
                height: 0
            },
            toolboxConfig: {
                x: 1,
                y: 1, 
                width: 0,
                height: 0,
                stroke: '#CFD8DC',
                strokeWidth: 1,
                draggable: true
            }
        }
    },

    mounted() {
        let _this = this;
        this.title = this.$route.params.name;

        this.konvaConfig.width = window.innerWidth - 2;
        this.konvaConfig.height = window.innerHeight - sessionStorage.getItem('topbarHeight') - 2;
        this.toolboxConfig.width = this.konvaConfig.width * 0.1 - 2;
        this.toolboxConfig.height = this.konvaConfig.height - 2;
        this.toolboxConfig.x = this.konvaConfig.width * 0.76;

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