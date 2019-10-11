<template>
    <v-app>
        <!-- Navigation drawer component -->
        <layout-navigation />
    </v-app>
</template>

<script>
export default {
    components: {
        LayoutNavigation: () => import('@/components/layout/Navigation')
    },
    data: () => ({
    }),
};
</script>
