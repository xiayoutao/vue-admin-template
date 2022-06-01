<template>
	<div class="layout-container" :class="{ hideSidebar: sidebarFold }">
		<div class="sidebar-container">
			<div class="system-name">
				<span class="short">{{ activeSystemName.slice(0, 2) }}</span>
				<span class="long">{{ activeSystemName }}</span>
			</div>
			<el-scrollbar wrap-class="scrollbar-wrapper">
				<el-menu
					ref="sidebarMenu"
					class="sidebar"
					:default-active="activeMenu"
					:collapse="sidebarFold"
					:collapseTransition="false"
					:unique-opened="true"
					:background-color="variables.menuBg"
					:text-color="variables.menuText"
				>
					<sidebar-item
						v-for="(item, index) in menuList"
						:key="index"
						:menu="item"
					></sidebar-item>
				</el-menu>
			</el-scrollbar>
		</div>
		<div class="layout-header">
			<navbar></navbar>
		</div>
		<div class="main-container">
			<div class="tags-view">
				<tags-view></tags-view>
			</div>
			<div ref="PageRoot" id="PageRoot" class="app-main scrollbar">
				<transition name="fade-transform" mode="out-in">
					<keep-alive :include="cachedViews">
						<router-view class="page-main" />
					</keep-alive>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Navbar from './components/navbar.vue';
import SidebarItem from './components/sidebar-item.vue';
import TagsView from './components/tags-view.vue';
import variables from '@/styles/variables.scss';
import { getToken, getRefreshToken } from '@/utils/auth';
import { refreshToken } from '@/apis/login';

export default {
	name: 'Layout',
	components: {
		Navbar,
		SidebarItem,
		TagsView,
	},
	data() {
		return {
			refreshTime: null,
		};
	},
	computed: {
		...mapGetters([
			'tenantId',
			'sidebarFold',
			'cachedViews',
			'menuList',
			'topMenu',
			'topMenuId',
		]),
		variables() {
			return variables;
		},
		activeTopMenu() {
			return (
				(this.topMenu || []).find((item) => this.topMenuId === item.code) || {}
			);
		},
		activeSystemName() {
			return this.activeTopMenu.name || '';
		},
		// 当前菜单
		activeMenu() {
			const route = this.$route;
			const { meta, path } = route;
			if (meta.activeMenu) {
				return meta.activeMenu;
			}
			return path;
		},
	},
	created() {
		if (getToken()) {
			this.refreshToken();
			this.getTreeDept(); // 部门
			this.getTreeMenu(); // 菜单
			this.getTreeDict(); // 所有业务字典
			this.getTreeRegion(); // 省市区
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.getPageAreaHeight();
		});
	},
	beforeDestroy() {
		clearInterval(this.refreshTime);
	},
	methods: {
		...mapMutations(['setPageHeight']),
		...mapActions([
			'getTreeDept',
			'getTreeMenu',
			'getTreeDict',
			'getTreeRegion',
		]),
		getPageAreaHeight() {
			// 获取页面显示区域高度
			const pageHeight = this.$refs.PageRoot.clientHeight;
			this.setPageHeight(pageHeight);
		},
		// 定时检测token
		refreshToken() {
			this.refreshTime = setInterval(() => {
				refreshToken({
					tenantId: this.tenantId,
					refresh_token: getRefreshToken(),
				}).then(({ data }) => {
					this.$store.commit('setToken', data.access_token);
					this.$store.commit('setRefreshToken', data.refresh_token);
					this.$store.commit('setUserInfo', data);
				});
			}, 5 * 60 * 1000);
		},
	},
};
</script>

<style lang="scss">
@import './styles/sidebar.scss';

.layout-container {
	position: relative;
	width: 100%;
	height: 100%;
}
.layout-header {
	height: $headerHeight;
	overflow: hidden;
}
.main-container {
	position: relative;
	min-height: 100%;
	margin-left: $sideBarWidth;
	transition: margin-left 0.28s;
}
.tags-view {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 32px;
	background: #e2e2e2;
}
.app-main {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: calc(100vh - 88px);
	overflow: hidden;
	overflow-y: auto;
}
.page-main {
	position: relative;
	box-sizing: border-box;
	height: calc(100vh - 88px);
	padding: 8px;
}
.menu-icon {
	width: 1em;
	height: 1em;
	margin-right: 10px;
}

.hideSidebar {
	.main-container {
		margin-left: 56px;
	}
	.navbar .logo {
		width: 56px !important;
		min-width: 56px !important;
		background-size: 36px auto;
	}
	.sidebar-container {
		width: 56px !important;

		.system-name {
			padding-left: 0;
			text-align: center;

			.short {
				display: block;
			}
			.long {
				display: none;
			}
		}
	}
	.menu-icon {
		margin-left: 20px;
	}
	.submenu-title-noDropdown {
		position: relative;
		padding: 0 !important;

		.el-tooltip {
			padding: 0 !important;

			.svg-icon {
				margin-left: 20px;
			}

			.sub-el-icon {
				margin-left: 19px;
			}
		}
	}

	.el-submenu {
		overflow: hidden;

		& > .el-submenu__title {
			padding: 0 !important;

			.svg-icon {
				margin-left: 20px;
			}

			.sub-el-icon {
				margin-left: 19px;
			}

			.el-submenu__icon-arrow {
				display: none;
			}
		}
	}

	.el-menu--collapse {
		.el-submenu {
			& > .el-submenu__title {
				& > span {
					display: inline-block;
					width: 0;
					height: 0;
					overflow: hidden;
					visibility: hidden;
				}
			}
		}
	}
}
</style>
