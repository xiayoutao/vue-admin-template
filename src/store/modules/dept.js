import { cloneDeep } from 'lodash';
import { getDeptTree } from '@/apis/system/dept';

export default {
	state: {
		treeDept: [], // 树形结构
	},
	getters: {
		treeDept: (state) => state.treeDept || [],
	},
	mutations: {
		setTreeDept(state, val) {
			state.treeDept = val || [];
		},
	},
	actions: {
		getTreeDept({ commit }) {
			return new Promise((resolve) => {
				getDeptTree().then((res) => {
					const data = res.data || [];
					commit('setTreeDept', cloneDeep(data));
					resolve(data);
				});
			});
		},
	},
};
