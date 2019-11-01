import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify';
import VueKonka from 'vue-konva';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueKonka);

const PATHS = [
    { 
        path: '/',
        viewname: 'Dashboard'
    },
    {
        path: '/setting',
        viewname: 'Setting'
    },
    {
        path: '/workbench/:name',
        viewname: 'Workbench'
    }
]

const router = new VueRouter({
    routes: PATHS.map(path => route(path))
});

export const EVENTBUS = new Vue();

function route ({ path, viewname }) {
    return {
        path,
        view: viewname,
        name: viewname,
        component: (resolve) => import(`@/views/${viewname}.vue`).then(resolve)
    }
}

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app');