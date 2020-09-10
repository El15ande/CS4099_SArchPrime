<template>
    <v-app-bar
        app
        clipped-right
        dark
        color="indigo darken-4"
    >
        <v-app-bar-nav-icon @click.stop="_commit('changeLeft')"></v-app-bar-nav-icon>
        <v-toolbar-title>ArchPrime</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-app-bar-nav-icon @click.stop="_commit('changeRight')"></v-app-bar-nav-icon>
    </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import Store from '../../store/index';

export default Vue.extend({
    methods: {
        _commit(target) {
            Store.commit(target);
        }
    }
});
</script>