<template>
	<x-dialog title="用户角色" :visible.sync="visible" width="500px">
		<el-tree
			ref="tree"
			:data="grantList"
			node-key="id"
			show-checkbox
			default-expand-all
			:default-checked-keys="roleIds"
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
import { getRoleTree } from '@/apis/system/role';
import { grant } from '@/apis/system/user';

export default {
	mixins: [DialogMixin],
	props: {
		show: Boolean,
	},
	data() {
		return {
			visible: false,
			userId: '',
			userName: '',
			roleIds: [],
			grantList: [],
			checkedKeys: [],
		};
	},
	methods: {
		init(data) {
			this.userId = data.id;
			this.userName = data.name;
			this.roleIds = data.roleId.split(',');
			this.getDataList();
		},
		getDataList() {
			getRoleTree().then(({ data }) => {
				this.grantList = data;
			});
		},
		handleSubmit() {
			let checkedKeys = this.$refs.tree.getCheckedKeys();
			const halfKeys = this.$refs.tree.getHalfCheckedKeys();
			if (checkedKeys.length === 0 && halfKeys.length === 0) {
				this.$message.warning('请选择角色权限');
				return;
			}
			grant({
				roleIds: checkedKeys.join(','),
				userIds: this.userId,
			}).then(() => {
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
