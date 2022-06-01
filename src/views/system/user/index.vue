<template>
	<div class="page-user">
		<element-table
			:data="dataList"
			:columns="tableColumns"
			:calc-height="true"
			@selection-change="handleSelectionChange"
		>
			<template #search>
				<x-filters :config="tableSearch" @change="getDataList"></x-filters>
			</template>
			<template #toolbar>
				<el-button
					type="primary"
					icon="el-icon-plus"
					@click="handleAdd()"
					v-if="getBtnAuth('user.add')"
				>
					新增
				</el-button>
				<el-button
					type="warning"
					icon="el-icon-edit-outline"
					@click="handleUpdate()"
					v-if="getBtnAuth('user.edit')"
				>
					修改
				</el-button>
				<el-button
					type="danger"
					icon="el-icon-delete"
					@click="handleDelete()"
					v-if="getBtnAuth('user.delete')"
				>
					删除
				</el-button>
				<el-button
					type="warning"
					icon="el-icon-lock"
					@click="handleResetPwd()"
					v-if="getBtnAuth('user.resetPwd')"
				>
					重置密码
				</el-button>
				<el-button
					type="primary"
					icon="el-icon-user"
					@click="handleSetRole()"
					v-if="getBtnAuth('user.role')"
				>
					角色
				</el-button>
			</template>
			<template #pagination>
				<x-pagination
					:config="{ total: total, size: pageSize }"
					@on-page="handlePageChange"
				></x-pagination>
			</template>
		</element-table>
		<add-or-update
			ref="addOrUpdate"
			:show.sync="addOrUpdateVisible"
			@success="getDataList()"
		></add-or-update>
		<set-role
			ref="setRole"
			:show.sync="setRoleVisible"
			@success="getDataList()"
		></set-role>
	</div>
</template>

<script>
import { getTableColumns } from './tableColumns';
import AddOrUpdate from './dialog-add-update.vue';
import SetRole from './dialog-set-role.vue';
import { getList, remove, resetPassword } from '@/apis/system/user';

export default {
	name: 'user',
	components: {
		AddOrUpdate,
		SetRole,
	},
	data() {
		return {
			addOrUpdateVisible: false,
			setRoleVisible: false,
			tableColumns: getTableColumns(this),
			tableSearch: [
				{
					type: 'input',
					label: '工号',
					key: 'account',
					width: '130px',
				},
				{
					type: 'input',
					label: '用户名称',
					key: 'realName',
					width: '130px',
				},
				{
					type: 'selectTree',
					label: '所属部门',
					key: 'dept',
					width: '130px',
					options: [],
					dataType: 'store',
					dataSource: 'treeDept',
				},
			],
			currentPage: 1,
			pageSize: 20,
			total: 0,
			dataList: [],
			tableSelection: [],
		};
	},
	created() {
		this.getDataList();
	},
	methods: {
		getDataList(parmas = {}) {
			getList({
				...parmas,
				current: this.currentPage,
				size: this.pageSize,
			}).then(({ data }) => {
				this.total = data.total;
				this.dataList = data.records || [];
			});
		},
		handleAdd() {
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.init();
			});
		},
		handleUpdate() {
			if (!this.isSelectionOne()) {
				return;
			}
			const data = this.tableSelection[0];
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.init(data.id);
			});
		},
		handleResetPwd() {
			if (this.tableSelection.length === 0) {
				return this.$message.warning('请选择用户');
			}
			this.$confirm('确定将选择账号密码重置为 123456 ？', this.confirmTitle, {
				confirmButtonText: this.confirmButtonText,
				cancelButtonText: this.cancelButtonText,
				customClass: this.confirmCustomClass,
				type: 'warning',
			}).then(() => {
				resetPassword(
					this.tableSelection.map((item) => item.id).join(','),
				).then(() => {
					this.getDataList(true);
					this.$message({
						type: 'success',
						message: '重置密码成功',
					});
				});
			});
		},
		handleSetRole() {
			if (!this.isSelectionOne()) {
				return;
			}
			const data = this.tableSelection[0];
			this.setRoleVisible = true;
			this.$nextTick(() => {
				this.$refs.setRole.init(data);
			});
		},
		handleDelete() {
			if (!this.isSelectionOne()) {
				return;
			}
			const data = this.tableSelection[0];
			this.$confirm('删除用户，是否继续？', this.confirmTitle, {
				confirmButtonText: this.confirmButtonText,
				cancelButtonText: this.cancelButtonText,
				customClass: this.confirmCustomClass,
				type: 'warning',
			}).then(() => {
				remove(data.id).then(() => {
					this.getDataList(true);
					this.$message({
						type: 'success',
						message: '删除成功',
					});
				});
			});
		},
		handleSelectionChange(selection) {
			this.tableSelection = selection;
		},
		handlePageChange({ type, current, size }) {
			if (type === 'current') {
				this.currentPage = current;
				this.getDataList();
			} else if (type === 'size') {
				this.currentPage = 1;
				this.pageSize = size;
				this.getDataList();
			}
		},
		isSelectionOne() {
			if (this.tableSelection.length === 0) {
				this.$message({
					type: 'warning',
					message: '请选择一条数据',
				});
				return;
			}
			if (this.tableSelection.length !== 1) {
				this.$message({
					type: 'warning',
					message: '只能操作单条数据',
				});
				return;
			}
			return true;
		},
	},
};
</script>

<style lang="scss" scoped></style>
