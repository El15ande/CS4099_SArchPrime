<template>
    <v-app>
        <left-drawer />
        <right-drawer />
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import LeftDrawer from './components/layout/LeftDrawer.vue';
import RightDrawer from './components/layout/RightDrawer.vue';

export default Vue.extend({
    name: 'App',

    components: {
        TopBar,
        LeftDrawer,
        RightDrawer
    }
});
</script>
