<template>
    <v-app>
        <layout-navigation />

        <layout-topbar />

        <layout-mainview />
    </v-app>
</template>

<script>
import axios from 'axios';

export default {
    components: {
        LayoutNavigation: () => import('@/components/layout/Navigation'),
        LayoutTopbar: () => import('@/components/layout/TopBar'),
        LayoutMainview: () => import('@/components/layout/Mainview') 
    },

    data: () => ({
    }),

    watch: {
        '$route': 'fetchList'
    },

    methods: {
        fetchList() {
            axios({
                method: 'get',
                url: 'https://yw69.host.cs.st-andrews.ac.uk/node',
                crossDomain: true
            }).then(function(res) {
                console.log(res);
            });
        }
    }
};
</script>
