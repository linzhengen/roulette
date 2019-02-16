import Vue from 'vue';
import Router from 'vue-router';
import Layout from './views/Layout.vue';
import Roulette from './views/Roulette.vue';

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
          component: Roulette,
        },
        {
          name: 'option',
          path: 'option',
          component: () => import(/* webpackChunkName: "user" */ './views/Option.vue'),
        },
      ],
    },
  ],
});
