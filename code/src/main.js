import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify';
import AXIOS from 'axios';

Vue.config.productionTip = false;
Vue.use(VueRouter);

//const SERVER = 'https://yw69.host.cs.st-andrews.ac.uk/node';
const SERVER = 'http://localhost:20804/';
const PATHS = [
    { 
        path: '/',
        viewname: 'Dashboard'
    },
    {
        path: '/Customisation',
        viewname: 'Customisation'
    },
    {
        path: '/workbench/:name',
        viewname: 'Workbench'
    }
];

const router = new VueRouter({
    routes: PATHS.map(path => route(path))
});

function route({ path, viewname }) {
    return {
        path,
        view: viewname,
        name: viewname,
        component: (resolve) => import(`@/views/${viewname}.vue`).then(resolve)
    }
}



// Exports;
export const EVENTBUS = new Vue();

export function AxiosRequest(method, query, data, success) {
    AXIOS({
        method,
        data,
        url: `${SERVER}${query}`,
        crossDomain: true
    }).then((res) => {
        if(success) success(res);
    }).catch(() => {});
}

// Root instance;
new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app');