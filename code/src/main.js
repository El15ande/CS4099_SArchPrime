import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.use(VueRouter);

const paths = [
  { 
    path: '/',
    view: 'Dashboard',
    name: 'Dashboard'
  }
]

const router = new VueRouter({
  routes: paths
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');