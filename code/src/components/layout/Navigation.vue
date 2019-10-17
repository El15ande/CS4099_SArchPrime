<template>
    <v-navigation-drawer 
    app
    dark
    permanent
    color="indigo darken-1"
    >
        <v-list-item two-line>
            <v-list-item-title class="title">
                Senior Honours Project
            </v-list-item-title>
        </v-list-item>

        <v-divider class="mx-3 mb-3" />

        <v-subheader class="mt-4 light">My Tools</v-subheader>
       
        <v-list nav>
            <div />
            <v-list-item
                v-for='(link, i) in tool_links'
                :key='i'
                :to='link.to'
                active-class="primary"
            >
                <v-list-item-action>
                    <v-icon>{{ link.icon }}</v-icon>
                </v-list-item-action>
                
                <v-list-item-title v-text='link.title' />
            </v-list-item>
        </v-list>

        <v-subheader class="mt-4 light">My Architectures</v-subheader>

        <v-list>
            <v-list-item
                v-for='(arch, i) in arch_links'
                :key='i'
            >   
                
                <v-list-item-action>
                    <v-icon>{{ arch.icon }}</v-icon>
                </v-list-item-action>

                <v-list-item-title v-text="arch.title" />
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    data: () => ({
        tool_links: [
            { 
                to: '/',
                title: 'Dashboard',
                icon: 'mdi-view-dashboard-variant' 
            },
            {
                to: '/setting',
                title: 'Setting',
                icon: 'mdi-settings-outline'
            }
        ],

        arch_links: [
            {
                title: 'My Architecture 1',
                icon: 'mdi-file-tree'
            },
            {
                title: 'My Architecture 2',
                icon: 'mdi-file-tree'
            }
        ]
    })
};
</script>