<template>
    <v-app-bar
    app
    absolute
    flat
    color='transparent'
    >
        <v-toolbar-title>
            {{ title }}
        </v-toolbar-title>
    </v-app-bar>
</template>

<script>
export default {
    data: () => ({
        title: 'Dashboard',
    })
}
</script>