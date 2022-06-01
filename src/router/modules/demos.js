const importPage = (view) => () =>
	import(/* webpackChunkName: "[request]" */ `@/views/demos${view}`);

export default [
	{
		path: '/demo',
		name: 'demo',
		meta: {
			title: '车辆管理',
			isAuth: false,
		},
		component: importPage('/car.vue'),
	},
	{
		path: '/demo1',
		name: 'demo1',
		meta: {
			title: '简单表格',
			isAuth: false,
		},
		component: importPage('/simpleTablePage.vue'),
	},
	{
		path: '/demo2',
		name: 'demo2',
		meta: {
			title: '虚拟表格',
			isAuth: false,
		},
		component: importPage('/elementTablePage.vue'),
	},
	{
		path: '/demo3',
		name: 'demo3',
		meta: {
			title: '虚拟表格',
			isAuth: false,
		},
		component: importPage('/virtualTablePage.vue'),
	},
	{
		path: '/demo4',
		name: 'demo4',
		meta: {
			title: '表单管理',
			isAuth: false,
		},
		component: importPage('/formPage.vue'),
	},
	{
		path: '/demo5',
		name: 'demo5',
		meta: {
			title: '打印',
			isAuth: false,
		},
		component: importPage('/print.vue'),
	},
];
