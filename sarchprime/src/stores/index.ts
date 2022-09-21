import { markRaw } from "vue";
import { defineStore } from "pinia";
import { Setting } from '@element-plus/icons-vue';

export const useGlobalStore = defineStore({
    id: 'Global',

    state: () => {
        return {
            LANGUAGE: 0,

            // Navigator
            NAV_ITEMS: markRaw([
                { name: ['Compartmentalisation', '组件化'], icon: Setting }
            ]),
            NAV_CURRENT: 0
        }
    },
});