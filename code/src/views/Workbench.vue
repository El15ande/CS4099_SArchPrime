<template>
    <p>{{ archData }}</p>
</template>

<script>
import AXIOS from 'axios';
import { EVENTBUS } from '../main.js';
const REMOTEHOST = 'http://yw69.host.cs.st-andrews.ac.uk/node';
const LOCALHOST = 'http://localhost:20804/';

export default {
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
            method: 'post',
            url: LOCALHOST + 'arch',
            crossDomain: true,
            data: { title: _this.title }
        }).then((res) => {
            if(res.data.err) alert(`Cannot read file ${res.data.err.path}`);
            console.log(res.data);

            if(res.data) {
                _this.archData = res.data;
            }
        });
    }
}
</script>>