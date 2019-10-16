import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.use(VueRouter);

const paths = [
    { 
        path: '/',
        viewname: 'Dashboard'
    },
    {
        path: '/setting',
        viewname: 'Setting'
    }
]

function route ({ path, viewname }) {
    return {
        path,
        view: viewname,
        name: viewname,
        component: (resolve) => import(`@/views/${viewname}.vue`).then(resolve)
    }
}

const router = new VueRouter({
    routes: paths.map(path => route(path))
});

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app');