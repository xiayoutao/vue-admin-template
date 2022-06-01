import store from './store';
import router from './router';
import { getToken } from '@/utils/auth';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Message } from 'element-ui';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/404'];

const importPage = (view) => () =>
	import(/* webpackChunkName: "[request]" */ `@/views${view}/index.vue`);

router.beforeEach(async (to, from, next) => {
	NProgress.start();

	if (to.meta && to.meta.title) {
		document.title = to.meta.title;
	}

	const hasToken = getToken();
	const meta = to.meta || {};

	if (!hasToken) {
		// 判断是否需要认证，没有登录访问去登录页
		if (meta.isAuth === false || whiteList.indexOf(to.path) >= 0) {
			next();
			NProgress.done();
		} else {
			next(`/login?redirect=${to.path}`);
			NProgress.done();
		}
	}

	if (!router.options.isAddDynamicRoutes && whiteList.indexOf(to.path) < 0) {
		try {
			const routes = await store.dispatch('getRoutes');
			fnAddDynamicRoutes(routes);
			router.options.isAddDynamicRoutes = true;
			if (to.path === '/login') {
				next({ path: '/' });
				NProgress.done();
			} else {
				next(to.path);
				NProgress.done();
			}
		} catch (err) {
			Message.error('获取菜单出错，请重试！');
			next(`/login?redirect=${to.path}`);
			NProgress.done();
		}
	}
	next();
	NProgress.done();
});

router.afterEach((to) => {
	if (to.path === '/login') {
		// 退出登录后，重置设置isAddDynamicRoutes为false
		router.options.isAddDynamicRoutes = false;
	}
	NProgress.done();
});

/**
 * 添加动态路由
 * @param {*} menuList 菜单列表
 */
function fnAddDynamicRoutes(menuList = []) {
	console.log('%c<---- 新增动态路由 start ---->', 'color:pink');
	for (var i = 0; i < menuList.length; i++) {
		if (menuList[i].path && /\S/.test(menuList[i].path)) {
			var route = {
				name: menuList[i].name,
				path: menuList[i].path,
				meta: {
					isDynamic: true, // 标识为动态路由
					icon: menuList[i].icon,
					title: menuList[i].label,
					targetSystem: menuList[i].targetSystem,
				},
				component: null,
			};
			try {
				route.component = importPage(menuList[i].filePath) || null;
				router.addRoute('app', route);
			} catch (e) {
				console.log(e);
			}
		}
	}
	console.log('%c<---- 新增动态路由 end ---->', 'color:pink');
}
