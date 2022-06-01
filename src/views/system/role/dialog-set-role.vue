<template>
	<x-dialog
		title="角色权限配置"
		:visible.sync="visible"
		width="500px"
		height="606px"
	>
		<div class="role-list">
			<el-tree
				ref="treeMenu"
				:data="menuGrantList"
				:check-strictly="false"
				show-checkbox
				node-key="id"
				:default-checked-keys="menuTreeObj"
				:props="{ label: 'title', value: 'id' }"
			></el-tree>
		</div>
		<template #footer>
			<el-button
				type="primary"
				icon="el-icon-check"
				v-prevent-click
				@click="handleSubmit()"
			>
				提交
			</el-button>
			<el-button
				type="primary"
				icon="el-icon-refresh-left"
				@click="handleCancel()"
			>
				取消
			</el-button>
		</template>
	</x-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog';
import { grant } from '@/apis/system/role';
import { roleTreeKeys, grantTree } from '@/apis/system/menu';

export default {
	mixins: [DialogMixin],
	data() {
		return {
			id: null,
			checkedKeys: [], // 全选状态值
			menuTreeObj: [],
			menuGrantList: [],
			dataScopeTreeObj: [],
			apiScopeTreeObj: [],
			apiScopeGrantList: [],
			dataScopeGrantList: [],
		};
	},
	created() {
		this.getAllMenu();
	},
	methods: {
		init(id) {
			this.id = id;
			this.getDetailById(id);
		},
		// 提交权限设置
		handleSubmit() {
			let menuList = this.$refs.treeMenu.getCheckedKeys();
			const halfKeys = this.$refs.treeMenu.getHalfCheckedKeys();
			if (menuList.length === 0 && halfKeys.length === 0) {
				this.$message.warning('请选择菜单权限');
				return;
			}
			grant({
				menuIds: [...menuList, ...halfKeys],
				roleIds: [this.id],
			}).then(() => {
				this.$message.success('设置成功');
				this.$emit('success');
				this.visible = false;
			});
		},
		getDetailById(id) {
			roleTreeKeys(id).then(({ data }) => {
				this.$refs.treeMenu.setCheckedKeys([]);
				this.menuTreeObj = data.menu;
				this.dataScopeTreeObj = data.dataScope;
				this.apiScopeTreeObj = data.apiScope;
			});
		},
		// 获取所有菜单按钮
		getAllMenu() {
			grantTree().then(({ data }) => {
				this.menuGrantList = data.menu;
				this.dataScopeGrantList = data.dataScope;
				this.apiScopeGrantList = data.apiScope;
			});
		},
		getCheckedKeys(dataList = [], checkedKeys = []) {
			for (let i = 0, len = dataList.length; i < len; i++) {
				const item = dataList[i];
				if (item.children && item.children.length > 0) {
					this.getCheckedKeys(item.children, checkedKeys);
				} else {
					if (this.menuTreeObj.includes(item.id)) {
						checkedKeys.push(item.id);
					}
				}
			}
			return checkedKeys;
		},
	},
};
</script>

<style>
.role-list {
	max-height: 600px;
	overflow-y: auto;
}
</style>
