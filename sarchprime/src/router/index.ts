import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Dashboard from '../views/Dashboard.vue';
import Assistance from '../views/Assistance.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/assistance',
    name: 'Assistance',
    component: Assistance
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
