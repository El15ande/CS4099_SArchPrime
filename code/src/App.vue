<template>
    <v-app>
        <layout-navigation />

        <layout-topbar />

        <layout-mainview />
    </v-app>
</template>

<script>
export default {
    components: {
        LayoutNavigation: () => import('@/layout/Navigation'),
        LayoutTopbar: () => import('@/layout/TopBar'),
        LayoutMainview: () => import('@/layout/Mainview') 
    }
};
</script>
