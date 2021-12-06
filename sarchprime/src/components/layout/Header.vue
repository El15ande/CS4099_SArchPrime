<template>

    <el-row>
        <el-col :span="12">
            <div v-if="serverMode">
                Online
            </div>
            <div v-else>
                <el-button 
                    color="var(--MAIN_THEME_DARK)" 
                    plain
                    @click="openADF">
                    Select local files
                </el-button>
            </div>
        </el-col>

        <el-col :span="2" :offset="10">
            <el-button v-if="serverMode" type="success" round @click="flipSAPServer(true)">Online</el-button>
            <el-button v-else type="danger" round @click="flipSAPServer(false)">Offline</el-button>
        </el-col>
    </el-row>

</template>

<script lang="ts">

import { defineComponent } from 'vue';

import SAPStore from '../../SAPStore';

export default defineComponent({
    computed: {
        serverMode():boolean {
            return SAPStore.serverState();
        },
    },

    methods: {
        flipSAPServer(isOnline:boolean):void {
            console.log(isOnline);
        },

        openADF():void {
            let adfLoader:HTMLInputElement = document.createElement('input');
            adfLoader.type = 'file';
            adfLoader.accept = '.adf,.json';

            adfLoader.click();
        }
    }
});

</script>

<style scoped>
h1 {
    color: var(--MAIN_THEME_DARK);
}

input {
    display: none;
}
</style>