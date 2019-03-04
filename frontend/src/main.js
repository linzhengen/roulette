import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  Transfer, DropdownItem, Dropdown, DropdownMenu,
  Badge, InputNumber, Popover, Form, FormItem, Tag, Dialog,
  Button, Table, TableColumn, Input, Loading,
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
Vue.use(Loading.directive);

Vue.component(Dialog.name, Dialog);
Vue.component(Transfer.name, Transfer);
Vue.component(Dropdown.name, Dropdown);
Vue.component(DropdownItem.name, DropdownItem);
Vue.component(DropdownMenu.name, DropdownMenu);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Popover.name, Popover);
Vue.component(Badge.name, Badge);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Button.name, Button);
Vue.component(Tag.name, Tag);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Input.name, Input);
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
