import { getTree } from '@/apis/system/region';
import { cloneDeep } from 'lodash';

export default {
	state: {
		treeRegion: [],
	},
	getters: {
		treeRegion: (state) => state.treeRegion || [],
	},
	mutations: {
		setTreeRegion(state, val) {
			state.treeRegion = val || [];
		},
	},
	actions: {
		getTreeRegion({ commit }) {
			return new Promise((resolve) => {
				getTree().then((res) => {
					const data = res.data || [];
					commit('setTreeRegion', cloneDeep(data));
					resolve(data);
				});
			});
		},
	},
};
