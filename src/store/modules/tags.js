// 首页
const dashboard = {
	path: '/dashboard',
	fullPath: '/dashboard',
	name: 'dashboard',
	title: '首页',
	meta: {
		title: '首页',
		affix: true,
	},
};

export default {
	state: {
		visitedViews: JSON.parse(
			sessionStorage.getItem('visitedViews') || JSON.stringify([dashboard]),
		),
		cachedViews: [dashboard.name],
	},
	getters: {
		visitedViews: (state) => state.visitedViews,
		cachedViews: (state) => state.cachedViews,
	},
	mutations: {
		addVisitedView(state, view) {
			if (state.visitedViews.some((v) => v.path === view.path)) return;
			state.visitedViews.push({
				name: view.name,
				path: view.path,
				fullPath: view.fullPath,
				query: view.query,
				title: view.meta.title || 'no-name',
				meta: view.meta,
			});
		},
		addCachedView(state, view) {
			if (state.cachedViews.includes(view.name)) return;
			if (!view.meta.noCache) {
				state.cachedViews.push(view.name);
			}
		},
		updateVisitedView(state, view) {
			for (let v of state.visitedViews) {
				if (v.path === view.path) {
					v = {
						name: view.name,
						path: view.path,
						fullPath: view.fullPath,
						query: view.query,
						title: view.meta.title,
						meta: view.meta,
					};
					break;
				}
			}
		},
		delVisitedView(state, view) {
			for (const [i, v] of state.visitedViews.entries()) {
				if (v.path === view.path) {
					state.visitedViews.splice(i, 1);
					break;
				}
			}
		},
		delCachedView(state, view) {
			const index = state.cachedViews.indexOf(view.name);
			index > -1 && state.cachedViews.splice(index, 1);
		},
		delOthersVisitedViews(state, view) {
			const filterTags = state.visitedViews.filter(
				(tag) => tag.name === view.name || tag.meta.affix,
			);
			state.visitedViews = filterTags;
		},
		delOthersCachedViews(state, view) {
			const filterTags = state.visitedViews.filter(
				(tag) => tag.name === view.name || tag.meta.affix,
			);
			console.log(filterTags);
			state.cachedViews = filterTags.map((tag) => tag.name);
		},
		delAllVisitedViews(state) {
			const affixTags = state.visitedViews.filter((tag) => tag.meta.affix);
			state.visitedViews = affixTags;
		},
		delAllCachedViews(state) {
			state.cachedViews = [];
		},
	},
	actions: {
		addView({ commit }, view) {
			commit('addVisitedView', view);
			commit('addCachedView', view);
		},
		delView({ commit, state }, view) {
			return new Promise((resolve) => {
				commit('delVisitedView', view);
				commit('delCachedView', view);
				resolve({
					visitedViews: [...state.visitedViews],
					cachedViews: [...state.cachedViews],
				});
			});
		},
		delOthersViews({ commit, state }, view) {
			return new Promise((resolve) => {
				commit('delOthersVisitedViews', view);
				commit('delOthersCachedViews', view);
				resolve({
					visitedViews: [...state.visitedViews],
					cachedViews: [...state.cachedViews],
				});
			});
		},
		delAllViews({ commit, state }, view) {
			return new Promise((resolve) => {
				commit('delAllVisitedViews', view);
				commit('delAllCachedViews', view);
				resolve({
					visitedViews: [...state.visitedViews],
					cachedViews: [...state.cachedViews],
				});
			});
		},
	},
};
