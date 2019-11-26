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
                v-for='(link, i) in toolList'
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

        <v-list nav>
            <v-list-item
                v-for='(arch, i) in archList'
                :key='i'
                :to='"/workbench/" + arch.title'
                active-class="primary"
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
import { AxiosRequest } from '../main.js';

export default {
    data() {
        return {
            toolList: [
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
            archList: []
        }
    },

    watch: {
        '$route': 'fetchArchList'
    },

    methods: {
        fetchArchList() {
            let _this = this;

            AxiosRequest('get', 'archlist', null, function(res) {
                _this.archList = res.data;
            });
        }
    },

    created() {
        this.fetchArchList();
    }
};
</script>