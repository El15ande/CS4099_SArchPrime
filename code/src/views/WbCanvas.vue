<template>
    <v-stage 
        :config='konvaConfig'
        style="background: #ffffff;"
    >
    </v-stage>
</template>

<script>
export default {
    data() {
        return {
            konvaConfig: {
                width: 0,
                height: 0
            }
        }
    },

    mounted() {
        this.konvaConfig.width = this.$parent.$refs.canvas.clientWidth - 8;
        this.konvaConfig.height = window.innerHeight - sessionStorage.getItem('topbarHeight') - 24;
    }
}
</script>