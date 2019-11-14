<template>
    <v-container fluid>
        <v-row>
            <v-col
                v-for='(arch, i) in archList'
                :key='i'
                :cols=4
            >
                <v-card
                    outlined
                >
                    <v-card-title>{{ arch.title }}</v-card-title>
                    <v-card-actions>
                        <v-btn 
                            text
                            :to='"/workbench/" + arch.title'
                        >
                            ENTER
                        </v-btn>

                        <v-btn
                            text
                            color="#ff0000"
                            @click.stop='deleteDialog = true'
                        >
                            DELETE
                        </v-btn>

                        <v-dialog
                            v-model='deleteDialog'
                            width='500'
                        >
                            <v-card>
                                <v-card-title>Delete {{ arch.title }}</v-card-title>
                                <v-card-text>Your information will be permenently deleted, are you sure?</v-card-text>
                                <v-card-actions>
                                    <v-spacer />
                                    <v-btn
                                        text
                                        color="red darken-1"
                                        @click='deleteArch(arch.title)'
                                    >
                                        Continue
                                    </v-btn>
                                    <v-btn
                                        text
                                        @click='deleteDialog = false'
                                    >
                                        Cancel
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col :cols=4>
                <v-card
                    shaped
                >
                    <v-card-title>Start a new architechture</v-card-title>
                    <v-card-actions>
                        <v-btn
                            text
                            color="teal darken-1"
                            @click.stop='createDialog = true'
                        >
                            CREATE
                        </v-btn>

                        <v-dialog
                            v-model='createDialog'
                            width='500'
                        >
                            <v-card>
                                <v-card-title>Create new architecture</v-card-title>
                                <v-card-actions>
                                    <v-text-field 
                                        v-model='createName'
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
                                        :disabled="!createName"
                                        @click='createArch()'
                                    >
                                        Continue
                                    </v-btn>
                                    <v-btn
                                        text
                                        @click='createDialog = false'
                                    >
                                        Cancel
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { EVENTBUS, AxiosRequest } from '../main.js';

export default {
    data() {
        return {
            archList: [],
            createDialog: false,
            createName: '',
            deleteDialog: false
        }
    },

    methods: {
        createArch() {
            let _this = this;
            this.createDialog = false;

            AxiosRequest('put', `arch/${_this.createName}`, function(res) {
                location.reload();
            });
        },
        deleteArch(archTitle) {
            this.deleteDialog = false;

            AxiosRequest('delete', `arch/${archTitle}`, function(res) {
                location.reload();
            });
        }
    },

    mounted() {
        let _this = this;
        
        EVENTBUS.$emit('FETCH_ARCHLIST');
        EVENTBUS.$on('RETURN_ARCHLIST', function(payload) {
            _this.archList = payload;
        });
    },

    beforeDestroy() {
        EVENTBUS.$off('RETURN_ARCHLIST');
    }
}
</script>