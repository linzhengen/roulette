import Vue from 'vue';
import Router from 'vue-router';
import Layout from './views/Layout.vue';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'root',
      component: Layout,
      children: [
        {
          name: 'home',
          path: '',
          component: Home,
        },
        {
          name: 'user',
          path: 'user',
          component: () => import(/* webpackChunkName: "user" */ './views/User.vue'),
        },
      ],
    },
  ],
});
