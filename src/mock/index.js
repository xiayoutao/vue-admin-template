/**
 * 模拟数据mock
 *
 * mock是否开启模拟数据拦截
 */

// 页面开启mock配置
const mockOption = {
	oauth: true,
	topmenu: true,
	menu: true,
	dict: true,
	user: true,
	role: true,
	dept: true,
	region: true,
	dashboard: true,
	demo: true,
};

function getModuleMockOpts(page) {
	const isOpen = mockOption[page];
	if (typeof isOpen === 'boolean') {
		return mockOption[page];
	}
	return false;
}

const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
	const value = modulesFiles(modulePath);
	modules[moduleName] = value.default;
	return modules;
}, {});

Object.keys(modules).forEach((item) => {
	if (typeof modules[item] === 'function') {
		modules[item]({ mock: getModuleMockOpts(item) });
	}
});
