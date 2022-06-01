import { cloneDeep } from 'lodash';
import {
	getTopMenu,
	getRoutes,
	getButtons,
	getMenuTree,
} from '@/apis/system/menu';

export default {
	state: {
		routes: [],
		topMenuId: localStorage.getItem('topMenuId') || '', // 当前顶级菜单ID
		topMenu: [],
		menuList: [],
		treeMenu: [],
	},
	getters: {
		routes: (state) => state.routes || [],
		topMenuId: (state) => state.topMenuId || '',
		topMenu: (state) => state.topMenu || [],
		menuList: (state) => state.menuList || [],
		treeMenu: (state) => state.treeMenu || [],
	},
	mutations: {
		setRoutes(state, val) {
			state.routes = val;
		},
		setTopMenuId(state, topMenuId) {
			state.topMenuId = topMenuId;
			localStorage.setItem('topMenuId', topMenuId);
		},
		setTopMenu(state, val) {
			state.topMenu = val || [];
		},
		setMenuList(state, val) {
			state.menuList = val || [];
		},
		setTreeMenu(state, val) {
			state.treeMenu = val || [];
		},
	},
	actions: {
		getTopMenu({ state, commit }) {
			return new Promise((resolve, reject) => {
				getTopMenu()
					.then((res) => {
						const data = res.data || [];
						commit('setTopMenu', data);
						if (data.length > 0) {
							const menu = data.find((item) => item.code === state.topMenuId);
							if (menu) {
								commit('setTopMenuId', menu.code);
							} else {
								commit('setTopMenuId', data[0].code);
							}
						}
						resolve(data);
					})
					.catch(() => {
						reject();
					});
			});
		},
		getMenuList({ commit, dispatch }, topMenuId) {
			return new Promise((resolve, reject) => {
				getRoutes(topMenuId)
					.then((res) => {
						const data = res.data || [];
						const menu = cloneDeep(data);
						if (menu.length === 1) {
							commit('setMenuList', menu[0].children);
						} else {
							commit('setMenuList', menu);
						}
						dispatch('getButtons');
						resolve(menu);
					})
					.catch(() => {
						reject();
					});
			});
		},
		getRoutes({ commit, dispatch }, topMenuId) {
			return new Promise((resolve, reject) => {
				getRoutes(topMenuId)
					.then((res) => {
						const data = res.data || [];
						const routes = getAllRoutes(data);
						commit('setRoutes', routes);
						dispatch('getButtons');
						resolve(routes);
					})
					.catch(() => {
						reject();
					});
			});
		},
		getButtons({ commit }) {
			return new Promise((resolve, reject) => {
				getButtons()
					.then((res) => {
						const data = res.data || [];
						commit('setPermission', data);
						resolve();
					})
					.catch(() => {
						reject();
					});
			});
		},
		getTreeMenu({ commit }) {
			return new Promise((resolve, reject) => {
				getMenuTree()
					.then((res) => {
						const data = res.data || [];
						commit('setTreeMenu', data);
						resolve(data);
					})
					.catch(() => {
						reject();
					});
			});
		},
	},
};

function getAllRoutes(menuList = []) {
	var res = [];
	menuList.forEach((item) => {
		const { children, ...i } = item;
		if (children && children.length) {
			res = res.concat(getAllRoutes(children));
		}
		res.push({
			id: i.id,
			name: i.code,
			label: i.name,
			path: i.path,
			icon: i.source,
			filePath: i.files || i.path,
			targetSystem: i.targetSystem,
		});
	});
	return res;
}
