<template>
	<div>
		<el-submenu
			:index="getMenuItemIndex(menu)"
			popper-append-to-body
			v-if="menu.children && menu.children.length > 0"
		>
			<template slot="title">
				<i class="menu-icon" :class="menu.source" v-if="menu.source"></i>
				<span>{{ menu.name }}</span>
			</template>
			<sidebar-item
				v-for="item in menu.children"
				:key="item.id"
				:menu="item"
			></sidebar-item>
		</el-submenu>
		<el-menu-item
			class="submenu-title-noDropdown"
			:index="getMenuItemIndex(menu)"
			:title="menu.name"
			@click.native="gotoRouteHandle(menu)"
			v-else
		>
			<i class="menu-icon" :class="menu.source" v-if="menu.source"></i>
			<span slot="title">{{ menu.name }}</span>
		</el-menu-item>
	</div>
</template>

<script>
import SidebarItem from './sidebar-item';

export default {
	name: 'SidebarItem',
	props: {
		menu: {
			type: Object,
			required: true,
		},
	},
	components: {
		SidebarItem,
	},
	methods: {
		getMenuItemIndex(menu) {
			return menu.path;
		},
		gotoRouteHandle(menu) {
			this.$router.push({
				path: menu.path,
			});
		},
	},
};
</script>
