import store from '@/store';
import { isUndefined, isFunction } from 'lodash';
import { isDeFined, isEmptyObject } from '@/utils/types';
import { sleep, getObjectByPath } from '@/utils/util';
import {
	confirmTitle,
	confirmButtonText,
	cancelButtonText,
	confirmCustomClass,
} from '@/constants';

import XDialog from '@cps/Dialog';
import XFilters from '@cps/Filters';
import VirtualTable from '@cps/Table/virtual.vue';
import ElementTable from '@cps/Table/element.vue';
import SimpleTable from '@cps/Table/simple.vue';
import Pagination from '@cps/Pagination/index.vue';
import ContextMenu from '@cps/ContextMenu';
import FormConfig from '@cps/FormConfig';
import vPreventClick from '@/directives/prevent-click';

// 全局引入方法插件
export const GlobalPlugin = {
	install(Vue) {
		Vue.prototype.confirmTitle = confirmTitle;
		Vue.prototype.confirmButtonText = confirmButtonText;
		Vue.prototype.cancelButtonText = cancelButtonText;
		Vue.prototype.confirmCustomClass = confirmCustomClass;
		Vue.prototype.sleep = sleep; // 延迟函数
		Vue.prototype.isUndefined = isUndefined;
		Vue.prototype.isFunction = isFunction;
		Vue.prototype.isDeFined = isDeFined;
		Vue.prototype.isEmptyObject = isEmptyObject;
		Vue.prototype.getObjectByPath = getObjectByPath; // 根据对象路径查找值
		Vue.prototype.getBtnAuth = store.getters.getBtnAuth; // 获取按钮权限

		Vue.directive('prevent-click', vPreventClick); // 防止按钮短时间内重复提交
	},
};

// 引入全局组件插件
export const ComponentPlugin = {
	install(Vue) {
		// const requireComponent = require.context(
		// 	'../components',
		// 	true,
		// 	/index.vue$/,
		// ); // 只全局引入index.vue组件
		// requireComponent.keys().forEach((fileName) => {
		// 	const componentConfig = requireComponent(fileName);
		// 	// 全局注册组件
		// 	Vue.component(
		// 		componentConfig.default.name,
		// 		componentConfig.default || componentConfig,
		// 	);
		// });
		Vue.component('x-dialog', XDialog);
		Vue.component('x-filters', XFilters);
		Vue.component('x-pagination', Pagination);
		Vue.component('virtual-table', VirtualTable);
		Vue.component('element-table', ElementTable);
		Vue.component('simple-table', SimpleTable);
		Vue.component('context-menu', ContextMenu);
		Vue.component('form-config', FormConfig);
	},
};
