<template>
    <el-row>
        <el-col :span="22">
            <div v-if="serverState">Online</div>
            <div v-else>
                <el-button plain 
                    color="var(--MAIN_THEME_DARK)" 
                    @click="openADF"
                >
                    Select local files
                </el-button>
            </div>
        </el-col>

        <el-col :span="2">
            <el-button v-if="serverState" type="success" round @click="tryDisconnect">Online</el-button>
            <el-button v-else type="danger" round @click="tryConnect">Offline</el-button>
        </el-col>
    </el-row>

    <el-dialog v-model="showDialog" 
        width="33%"
        :title="dialogtitle"
    >
        <span>{{dialogtext}}</span>
        <template #footer>
            <el-button 
                @click="showDialog=false"
            >
                Confirm
            </el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import SAPStore from '../../SAPStore';



export default defineComponent({
    data() {
        return {
            showDialog: false,  // boolean
            dialogtitle: '',    // string
            dialogtext: ''      // string
        }
    },

    computed: {
        serverState():boolean {
            return SAPStore.serverState();
        },
    },

    methods: {
        _setDialog(title:string, text:string):void {
            this.dialogtitle = title;
            this.dialogtext = text;
            this.showDialog = true;
        },

        openADF():void {
            let adfLoader:HTMLInputElement = document.createElement('input');
            adfLoader.type = 'file';
            adfLoader.accept = '.json';

            adfLoader.click();
        },

        async tryConnect():Promise<void> {
            let connRes = await SAPStore.connect();

            this._setDialog(
                connRes ? 'SAPServer Connected' : 'SAPServer Not Detected',
                connRes ? 'Switched to online mode.' : 'Kept offline mode.'
            );
        },
        tryDisconnect():void {
            SAPStore.disconnect();

            this._setDialog(
                'SAPServer Disconnected',
                'Switched to offline mode.'
            );
        }
    },

    mounted() {
        this.tryConnect();
    }
});

</script>

<style scoped>
h1 {
    color: var(--MAIN_THEME_DARK);
}
</style>