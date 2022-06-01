import Vue from 'vue';
import VueRouter from 'vue-router';
import { Notification } from 'element-ui';
import Layout from '@/layouts/index.vue';

const originalPush = VueRouter.prototype.push;

//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((error) => error);
};

Vue.use(VueRouter);

const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
	const value = modulesFiles(modulePath);
	modules[moduleName] = value.default;
	return modules;
}, {});

let childRoutes = []; // 保存所有子系统路由
Object.keys(modules).forEach((item) => {
	childRoutes = childRoutes.concat([...modules[item]]);
});

// 全局路由
const mainRoutes = [
	{
		path: '/',
		name: 'app',
		component: Layout,
		redirect: '/dashboard',
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () =>
					import(
						/* webpackChunkName: "views-common" */ '@/views/common/redirect.vue'
					),
			},
			{
				path: '/dashboard',
				name: 'dashboard',
				meta: {
					title: '首页',
					affix: true,
				},
				component: () =>
					import(
						/* webpackChunkName: "views-dashboard-index-vue" */ '@/views/dashboard'
					),
			},
			...childRoutes,
		],
	},
	{
		path: '/login',
		name: 'login',
		title: '登录',
		meta: {
			title: '登录',
		},
		component: () =>
			import(/* webpackChunkName: "views-common" */ '@/views/common/login.vue'),
	},
	{
		path: '/404',
		meta: {
			title: '404',
		},
		component: () =>
			import(/* webpackChunkName: "views-common" */ '@/views/common/404.vue'),
	},
];

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	scrollBehavior: () => ({
		x: 0,
		y: 0,
	}),
	isAddDynamicRoutes: false, // 是否已经添加动态(菜单)路由
	routes: mainRoutes,
});

router.onError((error) => {
	console.log('路由报错', error.message);
	// Error: Loading chunk preStowage failed. (/css/preStowage.c5f746b4.css) at HTMLLinkElement.linkTag.onerror
	// Error: Loading css chunk preStowage failed. (/css/preStowage.c5f746b4.css) at HTMLLinkElement.linkTag.onerror
	const pattern = /Loading(.*?)chunk(.*?)failed/g;
	const isChunkLoadFailed = error.message.match(pattern);
	if (isChunkLoadFailed) {
		Notification.closeAll();
		Notification({
			type: 'error',
			title: '温馨提示',
			message: '当前页面有更新，请刷新页面（Ctrl+F5）重新进入',
			duration: 0,
		});
	} else if (error.message.indexOf('Cannot find module') >= 0) {
		Notification.closeAll();
		Notification({
			type: 'error',
			title: '温馨提示',
			message: '没有找到页面，请刷新页面（Ctrl+F5）重试',
			duration: 0,
		});
	}
});

export default router;
