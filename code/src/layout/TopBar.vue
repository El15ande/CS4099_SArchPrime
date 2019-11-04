<template>
    <v-app-bar 
    app
    absolute
    flat
    color="transparent"
    >
        <v-toolbar-title>
            {{ title }}
        </v-toolbar-title>
    </v-app-bar>
</template>

<script>
export default {
    data() {
        return {
            title: this.$route.params.name || this.$route.name
        }
    },

    watch: {
        '$route' (val) {
            this.title = val.params.name || val.name;
        }
    },

    mounted() {
        sessionStorage.setItem('topbarHeight', this.$el.offsetHeight);
    }
}
</script>