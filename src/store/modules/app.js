export default {
	state: {
		sidebarFold: false,
		pageHeight: 0,
	},
	getters: {
		sidebarFold: (state) => state.sidebarFold,
		pageHeight: (state) => state.pageHeight,
	},
	mutations: {
		toggleSideBar(state) {
			state.sidebarFold = !state.sidebarFold;
		},
		setPageHeight(state, val) {
			state.pageHeight = val;
		},
	},
};
