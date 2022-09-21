<template>
    <el-menu
    >
        <el-menu-item
            v-for="(item, index) in globalStore.NAV_ITEMS"
            :key="index"
            @click="globalStore.NAV_CURRENT = index + 1"
        >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{item.name[globalStore.LANGUAGE]}}</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores';

const globalStore = useGlobalStore();
</script>