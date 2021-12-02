<template>
    <el-container>
        <el-aside width="200px">
            <layout-sidebar />
        </el-aside>

        <el-container>    
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import LayoutSidebar from './components/layout/SideBar.vue';

export default defineComponent({
  components: {
    LayoutSidebar
  }
});
</script>

<style>
#app {
  --GLOBAL_FONT: "Segoe UI Web (West European)","Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;
  --MAIN_THEME_DARK: #000099;
  --MAIN_THEME_WHITE: #e6e6ff;
 
  font-family: var(--GLOBAL_FONT);

  height: 100vh;
}
</style>
