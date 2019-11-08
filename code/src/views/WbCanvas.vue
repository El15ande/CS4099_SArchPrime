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
                width: this.$parent.$refs.canvas.clientWidth - 8,
                height: window.innerHeight - sessionStorage.getItem('topbarHeight') - 24
            }
        }
    }
}
</script>