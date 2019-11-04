<template>
    <p>{{ archData }}</p>
</template>

<script>
import AXIOS from 'axios';
const REMOTEHOST = 'https://yw69.host.cs.st-andrews.ac.uk/node';
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
</script>>