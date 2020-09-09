<template>
    <v-app>
        <Topbar />
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Topbar from './components/layout/Topbar.vue';

export default Vue.extend({
    name: 'App',

    components: {
        Topbar
    }
});
</script>
