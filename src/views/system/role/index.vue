<template>
	<div class="page-role">
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
					v-if="getBtnAuth('role.add')"
				>
					新增
				</el-button>
				<el-button
					type="warning"
					icon="el-icon-edit-outline"
					@click="handleUpdate()"
					v-if="getBtnAuth('role.edit')"
				>
					修改
				</el-button>
				<el-button
					type="primary"
					icon="el-icon-delete"
					@click="handleDelete()"
					v-if="getBtnAuth('role.delete')"
				>
					删除
				</el-button>
				<el-button
					icon="el-icon-s-custom"
					@click="handleSetRole()"
					v-if="getBtnAuth('role.setting')"
				>
					权限设置
				</el-button>
				<!-- <el-button
					type="warning"
					icon="el-icon-turn-off"
					@click="handleEnable()"
				>
					启用
				</el-button> -->
				<el-button
					type="danger"
					icon="el-icon-delete"
					@click="handleStop()"
					v-if="getBtnAuth('role.edit')"
				>
					禁用
				</el-button>
			</template>
		</element-table>
		<add-or-update
			ref="addOrUpdate"
			:show.sync="addOrUpdateVisible"
			@success="getDataList"
		></add-or-update>
		<set-role ref="setRole" :show.sync="setRoleVisible"></set-role>
	</div>
</template>

<script>
import { getTableColumns } from './tableColumns';
import AddOrUpdate from './dialog-add-update.vue';
import SetRole from './dialog-set-role.vue';
import { getList, remove, stop } from '@/apis/system/role';

export default {
	name: 'sysrole',
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
					label: '角色编码',
					key: 'id',
					width: '130px',
				},
				{
					type: 'input',
					label: '角色名称',
					key: 'roleName',
					width: '130px',
				},
			],
			dataList: [],
			tableSelection: [],
		};
	},
	created() {
		this.getDataList();
	},
	methods: {
		async getDataList(parmas = {}) {
			const res = await getList({
				...parmas,
				parentId: 0,
			});
			this.dataList = res.data;
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
		handleDelete() {
			if (!this.isSelectionOne()) {
				return;
			}
			const data = this.tableSelection[0];
			this.$confirm('删除角色，是否继续？', this.confirmTitle, {
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
		handleSetRole() {
			if (!this.isSelectionOne()) {
				return;
			}
			const data = this.tableSelection[0];
			this.setRoleVisible = true;
			this.$nextTick(() => {
				this.$refs.setRole.init(data.id);
			});
		},
		// handleShow() {},
		// handleEnable() {},
		handleStop() {
			if (!this.isSelectionOne()) {
				return;
			}
			const data = this.tableSelection[0];
			this.$confirm('禁用角色，是否继续？', this.confirmTitle, {
				confirmButtonText: this.confirmButtonText,
				cancelButtonText: this.cancelButtonText,
				customClass: this.confirmCustomClass,
				type: 'warning',
			}).then(() => {
				stop(data.id).then(() => {
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
