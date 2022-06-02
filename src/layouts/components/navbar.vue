<template>
	<div class="navbar">
		<div class="logo">后台管理系统</div>
		<hamburger
			id="hamburger"
			class="hamburger"
			:is-active="sidebarFold"
			@toggleClick="toggleSideBar"
		/>
		<div class="sys-list">
			<span
				class="sys-link"
				:class="{ active: topMenuId === item.code }"
				v-for="(item, index) in topMenu"
				:key="index"
				@click="setTopMenuId(item.code)"
			>
				{{ item.name }}
			</span>
			<span
				class="arrow"
				:style="{ left: `${130 * toMenuActiveIndex}px` }"
			></span>
		</div>
		<div class="right-menu">
			<div class="searchbox">
				<input
					v-model="keywords"
					class="keywords"
					placeholder="请输入搜索内容"
				/>
				<span class="el-icon-search"></span>
			</div>
			<div class="rolename">
				<span class="el-icon-lock"></span>
				<span>{{ userInfo.role_name }}</span>
			</div>
			<div class="userbox line">
				<el-avatar :src="userInfo.avatar" :size="28" v-if="userInfo.avatar" />
				<el-avatar icon="el-icon-user-solid" :size="28" v-else />
				<span class="username">{{ userInfo.nick_name }}</span>
			</div>
			<!-- <el-dropdown class="userbox line" placement="bottom-end" trigger="click">
				<div class="">
					<el-avatar icon="el-icon-user-solid" :size="28" />
					<span class="username">{{ userInfo.nick_name }}</span>
					<i class="el-icon-arrow-down el-icon--right"></i>
				</div>
				<el-dropdown-menu class="custom-dropdown" slot="dropdown">
					<el-dropdown-item command="updatePwd" icon="el-icon-lock">
						修改密码
					</el-dropdown-item>
					<el-dropdown-item command="userSet" icon="el-icon-setting">
						用户设置
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown> -->
			<span class="logout line" @click="handleLogout()">退出</span>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Hamburger from './hamburger.vue';
import { getToken, removeToken, removeRefreshToken } from '@/utils/auth';

export default {
	components: {
		Hamburger,
	},
	data() {
		return {
			keywords: '',
		};
	},
	computed: {
		...mapGetters(['sidebarFold', 'userInfo', 'topMenu', 'topMenuId']),
		toMenuActiveIndex() {
			return (
				(this.topMenu || []).findIndex(
					(item) => this.topMenuId === item.code,
				) || 0
			);
		},
	},
	watch: {
		topMenuId: {
			handler(val) {
				this.$emit('change', val);
				if (!getToken()) return;
				this.getMenuList(val);
			},
			immediate: true,
		},
	},
	created() {
		if (getToken()) {
			this.getTopMenu();
		}
	},
	methods: {
		...mapMutations(['toggleSideBar', 'setTopMenuId', 'delAllVisitedViews']),
		...mapActions(['getTopMenu', 'getMenuList']),
		handleLogout() {
			this.$confirm('退出登录，是否继续', this.confirmTitle, {
				confirmButtonText: this.confirmButtonText,
				cancelButtonText: this.cancelButtonText,
				customClass: this.confirmCustomClass,
				type: 'warning',
			}).then(() => {
				removeToken();
				removeRefreshToken();
				this.delAllVisitedViews();
				this.$router.push({ path: '/login' });
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.navbar {
	@include flex-row(center, space-between);
	position: relative;
	height: 100%;
	overflow: hidden;
	background: $menuBg;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

	.logo {
		@include flex-row(center, center);
		width: $sideBarWidth;
		min-width: $sideBarWidth;
		height: 100%;
		color: #fff;
		font-size: 28px;
		transition: all 0.28s;
	}

	.hamburger {
		padding: 0 8px;
		cursor: pointer;
	}
	.sys-list {
		@include flex-row(center);
		position: relative;
		height: 100%;
		margin-left: 30px;

		.sys-link {
			@include flex-row(center, center);
			width: 130px;
			height: 100%;
			color: #c3c8c6;
			font-weight: 700;
			font-size: 16px;
			line-height: 21px;
			white-space: nowrap;
			cursor: pointer;

			&.active {
				color: $primary;
			}
		}
		.arrow {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 130px;
			height: 12px;
			transition: left 0.3s;
			&:after {
				position: absolute;
				bottom: 0;
				left: 50%;
				width: 0;
				height: 0;
				margin-left: -6px;
				border: 6px solid transparent;
				border-bottom-color: #e2e2e2;
				content: '';
			}
		}
	}
	.right-menu {
		@include flex-row(center, flex-end);
		flex: 1;
		height: 100%;
		padding: 0 10px;
		white-space: nowrap;

		.searchbox {
			@include flex-row(center, space-between);
			width: 28%;
			min-width: 100px;
			height: 32px;
			margin-right: 18px;
			padding: 0 8px;
			border: 1px solid #c3c8c6;
			border-radius: 6px;
			background-color: #242833;

			.keywords {
				width: 100%;
				height: 100%;
				margin-right: 6px;
				border: none;
				color: #fff;
				background-color: transparent;
				outline: none;
				opacity: 1;

				&::placeholder {
					color: #c3c8c6;
				}
				&:after {
					content: '';
				}
			}
			> span {
				color: #fff;
				cursor: pointer;
			}
		}
		.rolename {
			color: #c3c8c6;
			font-size: 16px;

			> span:first-child {
				margin-right: 3px;
			}
		}
		.userbox {
			@include flex-row(center);
			color: #c3c8c6;
			cursor: pointer;

			> div {
				@include flex-row(center);
			}

			.username {
				position: relative;
				margin-left: 5px;
			}
		}
		.logout {
			color: #c3c8c6;
			font-size: 16px;
			cursor: pointer;
		}
		.line {
			position: relative;
			padding-left: 20px;
			&:before {
				position: absolute;
				top: 50%;
				left: 10px;
				width: 1px;
				height: 19px;
				background-color: #d8d8d8;
				transform: translateY(-50%);
				opacity: 0.45;
				content: '';
			}
		}
	}
}
</style>
