<template>
    <el-container>
        <!-- Sidebar -->
        <el-aside width="15vw">
            <layout-sidebar />
        </el-aside>

        <el-container>
            <!-- Headbar -->
            <el-header height="5vh">
                <layout-header />
            </el-header>

            <!-- Main container -->
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import LayoutHeader from './components/layout/Header.vue';
import LayoutSidebar from './components/layout/SideBar.vue';



export default defineComponent({
    components: {
        LayoutHeader,
        LayoutSidebar
    }
});
</script>

<style>
#app {
    --GLOBAL_FONT: "Segoe UI Web (West European)","Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;
    --MAIN_THEME_DARK: #000099;
    --MAIN_THEME_WHITE: #e6e6ff;

    height: 100vh;

    font-family: var(--GLOBAL_FONT);
}
</style>
