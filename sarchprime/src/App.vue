<template>
    <el-container>
        <el-aside>
            <Navigator />
        </el-aside>
        <el-main>
            MAIN COMPONENT
        </el-main>
    </el-container>
</template>

<style>
#app {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.el-aside {
    width: 200px;
}
</style>

<script setup lang="ts">
import Navigator from './layouts/Navigator.vue';
</script>