<template>
    <v-navigation-drawer 
    app
    dark
    permanent
    color="indigo darken-1"
    >
        <v-list-item two-line>
            <v-list-item-title class="title">
                Senior Honours Project
            </v-list-item-title>
        </v-list-item>

        <v-divider class="mx-3 mb-3" />

        <v-subheader class="mt-4 light">My Tools</v-subheader>
       
        <v-list nav>
            <div />
            <v-list-item
                v-for='(link, i) in toolLinks'
                :key='i'
                :to='link.to'
                active-class="primary"
            >
                <v-list-item-action>
                    <v-icon>{{ link.icon }}</v-icon>
                </v-list-item-action>
                
                <v-list-item-title v-text='link.title' />
            </v-list-item>
        </v-list>

        <v-subheader class="mt-4 light">My Architectures</v-subheader>

        <v-list>
            <v-list-item
                v-for='(arch, i) in archLinks'
                :key='i'
            >   
                
                <v-list-item-action>
                    <v-icon>{{ arch.icon }}</v-icon>
                </v-list-item-action>

                <v-list-item-title v-text="arch.title" />
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import AXIOS from 'axios';
import { EVENTBUS } from '../../main.js';
const HOST = 'http://localhost:20803';

export default {
    data: () => ({
        toolLinks: [
            { 
                to: '/',
                title: 'Dashboard',
                icon: 'mdi-view-dashboard-variant' 
            },
            {
                to: '/setting',
                title: 'Setting',
                icon: 'mdi-settings-outline'
            }
        ],
        archLinks: []
    }),

    created() {
        this.fetchArchList();
    },

    watch: {
        '$route': 'fetchArchList'
    },

    methods: {
        fetchArchList() {
            AXIOS({
                method: 'get',
                url: HOST + '/archlist',
                crossDomain: true
            }).then((res) => {
                this.archLinks = res.data;
            });
        }
    }
};
</script>