<template>
	<x-dialog
		title="菜单配置"
		:visible.sync="visible"
		width="400px"
		height="400px"
	>
		<el-tree
			ref="tree"
			:data="grantList"
			node-key="id"
			show-checkbox
			:default-checked-keys="menuIds"
			:props="{ label: 'title', value: 'id' }"
		></el-tree>
		<template slot="footer">
			<el-button
				class="btn-custom"
				type="primary"
				size="mini"
				icon="el-icon-check"
				v-prevent-click
				@click="handleSubmit()"
			>
				确定
			</el-button>
			<el-button
				class="btn-custom"
				type="primary"
				size="mini"
				@click="visible = false"
			>
				取消
			</el-button>
		</template>
	</x-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog';
import { cloneDeep } from 'lodash';
import { grantTopTree, getTopTree } from '@/apis/system/menu';
import { grant } from '@/apis/system/topmenu';

export default {
	mixins: [DialogMixin],
	props: {
		show: Boolean,
	},
	data() {
		return {
			topMenuId: [],
			grantList: [],
			menuIds: [],
			checkedKeys: [],
		};
	},
	methods: {
		init(id) {
			this.topMenuId = id;
			this.getDataList(id);
		},
		getDataList(id) {
			if (!id) return;
			grantTopTree().then(({ data }) => {
				console.log('data', data);
				this.grantList = cloneDeep(data.menu || []);
			});
			getTopTree(id).then(({ data }) => {
				this.$refs.tree.setCheckedKeys([]);
				this.menuIds = cloneDeep(data.menu || []);
			});
		},
		handleSubmit() {
			let checkedKeys = this.$refs.tree.getCheckedKeys();
			const halfKeys = this.$refs.tree.getHalfCheckedKeys();
			if (checkedKeys.length === 0 && halfKeys.length === 0) {
				this.$message.warning('请选择角色权限');
				return;
			}
			grant([this.topMenuId], checkedKeys).then(() => {
				this.visible = false;
				this.$emit('success');
				this.$message.success('设置成功');
			});
		},
	},
	watch: {
		show(val) {
			this.visible = val;
		},
		visible(val) {
			this.$emit('update:show', val);
		},
	},
};
</script>

<style scoped lang="scss"></style>
