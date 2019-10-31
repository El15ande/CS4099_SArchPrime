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
        LayoutNavigation: () => import('@/components/layout/Navigation'),
        LayoutTopbar: () => import('@/components/layout/TopBar'),
        LayoutMainview: () => import('@/components/layout/Mainview') 
    }
};
</script>
