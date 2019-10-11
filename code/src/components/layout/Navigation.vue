<template>
    <v-navigation-drawer>
        <v-list nav>
            <div />

            <v-list-item
                v-for='(item, i) in items'
                :key='i'
            >
                <v-list-item-title v-text='item.title' />

            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    data: () => ({
        items: [
            { title: '1st item' },
            { title: '2nd item' }
        ]
    })
}
</script>>