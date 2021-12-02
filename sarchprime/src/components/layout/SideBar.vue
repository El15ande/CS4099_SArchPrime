<template>
    <el-menu
        default-active="1"
        active-text-color="var(--MAIN_THEME_DARK)"
    >

        <router-link to="/dashboard">
            <el-menu-item index="1">
                <el-icon><icon-menu /></el-icon>Dashboard
            </el-menu-item>
        </router-link>

        
        <router-link to="/assistance">
            <el-menu-item index="2">
                <el-icon><info-filled /></el-icon>Assistance
            </el-menu-item>
        </router-link>
    </el-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { 
    Menu as IconMenu,
    InfoFilled,
    Setting,
    Sort
} from '@element-plus/icons';

export default defineComponent({
    components: {
        IconMenu,
        InfoFilled,
        Setting,
        Sort
    }
});
</script>

<style scoped>
.el-menu {
    height: 100vh;

    --el-menu-hover-bg-color: var(--MAIN_THEME_WHITE);
}

a {
    text-decoration: none;
    color: inherit;
}
</style>