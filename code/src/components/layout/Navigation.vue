<template>
    <v-navigation-drawer 
    app
    dark
    color='indigo darken-1'
    >
        <v-list nav>
            <v-list-item two-line>
                <v-list-title class="title" two-line>
                    Senior Honours Project
                </v-list-title>
            </v-list-item>

             <v-divider class="mx-3 mb-3" />

            <v-list-item
                v-for='(link, i) in links'
                :key='i'
                :to='link.link'
            >
                <v-list-item-action>
                    <v-icon>{{ link.icon }}</v-icon>
                </v-list-item-action>
                
                <v-list-item-title v-text='link.title' />
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    data: () => ({
        links: [
            { 
                link: '/',
                title: 'Dashboard',
                icon: 'mdi-view-dashboard-variant' 
            }
        ]
    })
}
</script>>