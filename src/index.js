import store from './store'
import sdk from './sdk'
import api from './api'
import Layout from './component/Layout.vue';
import Login from './component/login/Login.vue';
import "./assets/fonts/iconfont.css"

import Vue from 'vue';
import {
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Link,
  Tabs,
  TabPane,
  Message
} from 'element-ui';

Vue.prototype.$ELEMENT = {
  size: 'small',
  zIndex: 3000
};
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Link);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Message);


export {
  store,
  sdk,
  api,
  Layout,
  Login
}
