import { setToken, setRefreshToken } from '@/utils/auth';
import { getObjectByPath } from '@/utils/util';

export default {
	state: {
		token: localStorage.getItem('token') || '',
		refreshToken: localStorage.getItem('refreshToken') || '',
		tenantId: process.env.VUE_APP_tenantId,
		userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
		permission: JSON.parse(localStorage.getItem('permission') || '{}'),
	},
	getters: {
		token: (state) => state.token,
		refreshToken: (state) => state.refreshToken,
		userInfo: (state) => state.userInfo,
		tenantId: (state) => state.tenantId,
		permission: (state) => state.permission,
		// 按钮权限
		getBtnAuth: (state) => {
			// moduleName 页面模块名称，根据按钮权限接口返回的值
			return (moduleName) => {
				return getObjectByPath(moduleName, state.permission, false);
			};
		},
	},
	mutations: {
		setToken(state, token) {
			state.token = token;
			setToken(token);
		},
		setRefreshToken(state, refreshToken) {
			state.refreshToken = refreshToken;
			setRefreshToken(refreshToken);
		},
		setUserInfo(state, userInfo = {}) {
			state.userInfo = userInfo;
			localStorage.setItem('userInfo', JSON.stringify(userInfo));
		},
		setPermission(state, val) {
			let permission = {}; // 保存到Map对象
			val.forEach((item) => {
				permission[item.code] = getCode(item.children);
			});
			state.permission = permission;
			localStorage.setItem('permission', JSON.stringify(permission));
		},
	},
	actions: {},
};

function getCode(list = []) {
	let result = {};
	list.forEach((item) => {
		result[item.alias] = true;
	});
	return result;
}
