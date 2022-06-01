<template>
	<div class="page-user">
		<element-table
			:data="dataList"
			:columns="tableColumns"
			:calc-height="true"
			@selection-change="handleSelectionChange"
		>
			<template #toolbar>
				<el-button
					type="primary"
					icon="el-icon-plus"
					@click="handleAdd()"
					v-if="getBtnAuth('topmenu.add')"
				>
					新增
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
		<menu-config ref="menuConfig" :show.sync="menuConfigVisible"></menu-config>
	</div>
</template>

<script>
import { getTableColumns } from './tableColumns';
import AddOrUpdate from './dialog-add-update.vue';
import MenuConfig from './dialog-menu-config.vue';
import { getList, remove } from '@/apis/system/topmenu';

export default {
	name: 'user',
	components: {
		AddOrUpdate,
		MenuConfig,
	},
	data() {
		return {
			addOrUpdateVisible: false,
			menuConfigVisible: false,
			tableColumns: getTableColumns(this),
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
		getDataList() {
			getList({
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
		handleUpdate(data) {
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.init(data.id);
			});
		},
		handleConfig(data) {
			this.menuConfigVisible = true;
			this.$nextTick(() => {
				this.$refs.menuConfig.init(data.id);
			});
		},
		handleDelete(data) {
			this.$confirm('删除顶部菜单，是否继续？', this.confirmTitle, {
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
