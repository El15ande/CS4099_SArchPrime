import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import App from './App.vue';

const Pinia = createPinia();

createApp(App)
.use(ElementPlus)
.use(Pinia)
.mount('#app');