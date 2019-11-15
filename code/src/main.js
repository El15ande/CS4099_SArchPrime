import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify';
import VueKonka from 'vue-konva';
import AXIOS from 'axios';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueKonka);

const REMOTEHOST = 'https://yw69.host.cs.st-andrews.ac.uk/node';
const LOCALHOST = 'http://localhost:20804/';
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
];

const router = new VueRouter({
    routes: PATHS.map(path => route(path))
});

export const EVENTBUS = new Vue();

function route({ path, viewname }) {
    return {
        path,
        view: viewname,
        name: viewname,
        component: (resolve) => import(`@/views/${viewname}.vue`).then(resolve)
    }
}

export function AxiosRequest(header, query, data, success) {
    AXIOS({
        method: header,
        url: `${LOCALHOST}${query}`,
        crossDomain: true,
        data
    }).then((res) => {
        if(success) success(res);
    }).catch((err) => {
        console.log(err);
    });
}

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app');