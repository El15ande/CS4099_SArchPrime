<template>
    <v-navigation-drawer
        v-model="drawerLeft"
        app
    >
    </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
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