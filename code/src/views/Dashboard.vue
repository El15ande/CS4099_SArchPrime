<template>
    <v-container
    fluid
    >
        <v-list
            v-for='(arch, i) in archLinks'
            :key='i'
        >
            <v-card color="grey" width="300px">
                <v-card-text>{{ arch.title }}</v-card-text>
            </v-card>
        </v-list>
    </v-container>
</template>

<script>
import { EVENTBUS } from '../main.js';

export default {
    data: () => ({
        archLinks: []
    }),

    mounted() {
        // TODO Eventbus to get data from navigation;
    }
}
</script>