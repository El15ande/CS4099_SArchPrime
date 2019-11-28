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
        </v-toolbar-items>

        <v-btn 
            icon
            @click.stop='createViewDialog = true'
            v-if="inWorkbench"
        >
            <v-icon>mdi-file-document-box-plus</v-icon>
        </v-btn>

        <v-btn 
            icon
            @click.stop='deleteViewDialog = true'
            v-if="inWorkbench"
        >
            <v-icon>mdi-file-document-box-remove</v-icon>
        </v-btn>

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

<script>
import { EVENTBUS } from '../main.js';

export default {
    data() {
        return {
            // Page title;
            title: this.$route.params.name || this.$route.name,

            // Selection bar;
            inWorkbench: false,
            selectMargin: { 
                'margin-top': `${sessionStorage.getItem('topbarHeight') / 4 - 2}px`,
                'margin-left': `12px`
            },
            createViewDialog: false,
            createViewName: '',
            deleteViewDialog: false,
            archViews: [],
            selectedView: ''
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
        }
    },

    mounted() {
        let _this = this;
        
        sessionStorage.setItem('topbarHeight', this.$el.offsetHeight);

        if(this.$route.name === 'Workbench') {
            this.inWorkbench = true;
            EVENTBUS.$emit('FETCH_ARCHVIEWS');
        }

        EVENTBUS.$on('RETURN_ARCHVIEWS', function(payload) {
            _this.archViews = payload;
        });
    },

    beforeDestroy() {
        EVENTBUS.$off('RETURN_ARCHVIEWS');
    }
}
</script>