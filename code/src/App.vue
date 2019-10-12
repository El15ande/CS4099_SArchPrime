<template>
    <v-app>
        <layout-navigation />

        <layout-topbar />
    </v-app>
</template>

<script>
export default {
    components: {
        LayoutNavigation: () => import('@/components/layout/Navigation'),
        LayoutTopbar: () => import('@/components/layout/TopBar')
    },
    data: () => ({
    }),
};
</script>
