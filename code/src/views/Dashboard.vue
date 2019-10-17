<template>
    <v-container
    fluid
    >
        <v-stage :config="konva_config" style="border: 1px solid black">
            <v-layer>
                <v-rect :config="rect" />
                
                <v-text :config="text" />
            </v-layer>
        </v-stage>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        konva_config: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        rect: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            fill: '#ffffff',
            stroke: '#000000',
            draggable: true
        },
        text: {
            text: 'HelloWorld',
            draggable: true
        }
    })
}
</script>