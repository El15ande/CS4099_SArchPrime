<template>
    <v-app-bar 
    app
    absolute
    flat
    color="transparent"
    >
        <v-toolbar-title>{{ title }}</v-toolbar-title>

        <v-toolbar-items v-if="inWorkbench">
            <v-select
                label="Views"
                :items="archViews"
                :style="selectMargin"
                v-model="selectedView"
                dense
                outlined
            />

            <v-col style="padding-top: 15px;">
                <v-menu>
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            outlined
                            color="#1976d2"  
                            v-on="on"
                        >
                            TREEVIEW
                        </v-btn>
                    </template>

                    <v-treeview
                        dark
                        hoverable
                        :items='treeViewItems'
                    >
                        <template v-slot:prepend="{ item }">
                            <a @click="jumpView(item.cid, item.name)"><v-icon>{{ item.icon }}</v-icon></a>
                        </template>
                    </v-treeview>
                </v-menu>
            </v-col>
            
            <v-col style="padding-top: 15px;">
                <v-menu>
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            tile 
                            outlined
                            v-on="on"
                        >
                            VIEWS
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item
                            v-for="(item, i) in viewpointItems"
                            :key="i"
                            @click="item.action"
                        >
                            <v-list-item-icon>
                                <v-icon v-text="item.icon" />
                            </v-list-item-icon>
                            <v-list-item-title>{{ item.text }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-col>
        </v-toolbar-items>

        <v-spacer />
        <v-col
            offset-md="6"
            style="padding-top: 15px;"
        >
            <v-btn
                outlined 
                color="success"
            >
                <v-icon left>mdi-help-circle-outline</v-icon>HELP
            </v-btn>
        </v-col>    

        <v-dialog
            v-model='createViewDialog'
            width='500'
        >
            <v-card>
                <v-card-title>Create new view for {{ title }}</v-card-title>
                <v-card-actions>
                    <v-text-field 
                        v-model='createViewName'
                        outlined
                        :rules="['Required']"
                        label="Name" 
                    />
                </v-card-actions>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        text
                        color="teal darken-1"
                        :disabled="!createViewName"
                        @click='createView()'
                    >
                        Continue
                    </v-btn>
                    <v-btn
                        text
                        @click='createViewDialog = false'
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model='deleteViewDialog'
            width='500'
        >
                <v-card v-if='selectedView'>
                    <v-card-title>Delete {{ selectedView }}</v-card-title>
                    <v-card-text>This view will be permenently deleted, are you sure?</v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            text
                            color="red darken-1"
                            @click='deleteView(selectedView)'
                        >
                            Continue
                        </v-btn>
                        <v-btn
                            text
                            @click='deleteViewDialog = false'
                        >
                            Cancel
                        </v-btn>
                    </v-card-actions>
                </v-card>

                <v-card v-if='!selectedView'>
                    <v-card-title>No view to delete</v-card-title>
                    <v-card-text>You haven't selected a view yet.</v-card-text>
                </v-card>
        </v-dialog>
    </v-app-bar>
</template>

<style>
    .v-treeview-node {
        background-color: #1976d2;
    }
</style>

<script>
import { EVENTBUS } from '../main.js';

export default {
    data() {
        return {
            // Page title;
            title: this.$route.params.name || this.$route.name,

            viewpointItems: [
                { 
                    text: 'Go to overview', 
                    icon: 'mdi-file-document-box',
                    action: this.goOverview 
                },

                {
                    text: 'Create a new view',
                    icon: 'mdi-file-document-box-plus',
                    action: () => { this.createViewDialog = true }
                },

                {
                    text: 'Remove the current view',
                    icon: 'mdi-file-document-box-minus',
                    action: () => { this.deleteViewDialog = true }
                }
            ],

            // Selection bar;
            inWorkbench: false,
            selectMargin: { 
                'margin-top': `${sessionStorage.getItem('topbarHeight') / 4 - 2}px`,
                'margin-left': `12px`
            },

            archViews: [],
            selectedView: '',

            createViewDialog: false,
            createViewName: '',

            deleteViewDialog: false,

            treeViewItems: [{ name: "Choose a view", icon: "mdi-alert-rhombus" }],
        }
    },

    methods: {
        createView() {
            this.createViewDialog = false;

            EVENTBUS.$emit('DELIVER_CREATEVIEW', this.createViewName);
            this.createViewName = null;
            this.selectedView = null;
        },

        deleteView() {
            this.deleteViewDialog = false;
            this.archViews.splice(this.archViews.indexOf(this.selectedView), 1);

            EVENTBUS.$emit('DELIVER_REMOVEVIEW', this.selectedView);
            this.selectedView = null;
        },

        goOverview() {
            this.selectedView = null;
            EVENTBUS.$emit('DELIVER_GOOVERVIEW');
        },

        jumpView(id, name) {
            if(!id) return;

            EVENTBUS.$emit('DELIVER_JUMPVIEW', id, name);
        }
    },

    watch: {
        '$route' (val) {
            this.title = val.params.name || val.name;
            this.selectedView = '';

            if(val.name === 'Workbench') {
                this.inWorkbench = true;

                setTimeout(() => { // Wait for workbench reloading;
                    EVENTBUS.$emit('FETCH_ARCHVIEWS');
                }, 400);
            } else this.inWorkbench = false;
        },

        'selectedView' (val) {
            EVENTBUS.$emit('DELIVER_ENTERVIEW', val);
        }
    },

    mounted() {
        sessionStorage.setItem('topbarHeight', this.$el.offsetHeight);

        if(this.$route.name === 'Workbench') {
            this.inWorkbench = true;
            EVENTBUS.$emit('FETCH_ARCHVIEWS');
        }

        EVENTBUS.$on('RETURN_ARCHVIEWS', (payload) => {
            payload.forEach((item, index) => this.$set(this.archViews, index, item) );
        });

        EVENTBUS.$on('INVOKE_CREATEVIEW', () => {
            this.createViewDialog = true;
        });

        EVENTBUS.$on('INVOKE_ENTERVIEW', (payload) => {
            this.selectedView = payload;
        });

        EVENTBUS.$on('INVOKE_TREEVIEW', (payload = [{ name: "Choose a view", icon: "mdi-alert-rhombus" }]) => {
            this.treeViewItems = payload;
        })
    },

    beforeDestroy() {
        EVENTBUS.$off('RETURN_ARCHVIEWS');
        EVENTBUS.$off('INVOKE_CREATEVIEW');
        EVENTBUS.$off('INVOKE_ENTERVIEW');
        EVENTBUS.$off('INVOKE_TREEVIEW');
    }
}
</script>