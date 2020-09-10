<template>
    <v-navigation-drawer
        v-model="drawerLeft"
        app
    >
        <v-subheader>Tools</v-subheader>
        <v-subheader>Files</v-subheader>
    </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import Store from '../../store/index';

export default Vue.extend({
    computed: {
        drawerLeft: {
            get() { return Store.state.drawerLeft; },
            set() {}
        }
    }
});
</script>