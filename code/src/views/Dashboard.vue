<template>
    <v-container
    fluid
    >
        <v-row>
            <v-col
                v-for='(arch, i) in archList'
                :key='i'
                :cols=4
            >
                <v-card
                    outlined
                >
                    <v-card-title>{{ arch.title }}</v-card-title>
                    <v-card-actions>
                        <v-btn 
                            text
                            :to='"/workbench/" + arch.title'
                        >
                            Enter
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import AXIOS from 'axios';
import { EVENTBUS } from '../main.js';
const REMOTEHOST = 'http://yw69.host.cs.st-andrews.ac.uk/node';
const LOCALHOST = 'http://localhost:20804/';

export default {
    data() {
        return {
            archList: []
        }
    },

    mounted() {
        let _this = this;
        
        EVENTBUS.$emit('FETCH_ARCHLIST');
        EVENTBUS.$on('RETURN_ARCHLIST', function(payload) {
            _this.archList = payload;
        });
    },

    beforeDestroy() {
        EVENTBUS.$off('RETURN_ARCHLIST');
    }
}
</script>