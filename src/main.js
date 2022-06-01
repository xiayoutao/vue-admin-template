import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';

import './permission';

import '@/plugins/umy-ui';
import 'umy-ui/lib/theme-chalk/index.css'; // 引入样式

import '@/plugins/element-ui';
import './styles/element-variables.scss';
import './styles/resetElement.scss';

import { GlobalPlugin, ComponentPlugin } from '@/plugins';

Vue.use(GlobalPlugin);
Vue.use(ComponentPlugin);

Vue.prototype.$eventBus = new Vue(); // 事件名称规则：<页面>:<事件名>。如 page:reload

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
	store,
	router,
	render: (h) => h(App),
}).$mount('#app');
