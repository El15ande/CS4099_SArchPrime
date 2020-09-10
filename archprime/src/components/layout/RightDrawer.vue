<template>
    <v-navigation-drawer
        v-model="drawerRight"
        app
        clipped
        right
    >
    </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import Store from '../../store/index';

export default Vue.extend({
    computed: {
        drawerRight: {
            get() { return Store.state.drawerRight; },
            set() {}
        }
    }
});
</script>