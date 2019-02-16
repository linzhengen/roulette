import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  Transfer,
} from 'element-ui';
import lang from 'element-ui/lib/locale/lang/ja';
import locale from 'element-ui/lib/locale';
import VueMoment from 'vue-moment';
import VueApollo from 'vue-apollo';
import App from './App.vue';
import router from './router';
import store from './store';


import 'bulma/bulma.sass';
import '@fortawesome/fontawesome-free/css/all.css';

locale.use(lang);

Vue.use(VueMoment);
Vue.use(VueApollo);
Vue.component(Transfer.name, Transfer);
Vue.config.productionTip = false;

const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    link: new HttpLink({ uri: process.env.VUE_APP_API_URL }),
    cache: new InMemoryCache(),
  }),
});

new Vue({
  router,
  store,
  provide: apolloProvider.provide(),
  render: h => h(App),
}).$mount('#app');
