<template>
	<div class="page-table">
		<virtual-table
			ref="table"
			:datas="dataList"
			:columns="tableColumns"
			:calc-height="true"
			@selection-change="handleSelectionChange"
		>
			<template #search>
				<x-filters :config="tableSearch"></x-filters>
			</template>
			<template #toolbar>
				<el-button type="primary" icon="el-icon-plus" @click="handleAdd()">
					新增
				</el-button>
				<el-button
					type="warning"
					icon="el-icon-edit-outline"
					@click="handleUpdate()"
				>
					修改
				</el-button>
			</template>
			<template #pagination>
				<x-pagination
					:config="{ total: dataList.length }"
					@on-page="handlePageChange"
				></x-pagination>
			</template>
		</virtual-table>
		<add-or-update
			ref="addOrUpdate"
			:show.sync="addOrUpdateVisible"
			@success="getDataList()"
		></add-or-update>
	</div>
</template>

<script>
import AddOrUpdate from './dialog-add-update.vue';
import { pageList } from '@/apis/demo';

export default {
	name: 'tablefilter',
	components: {
		AddOrUpdate,
	},
	data() {
		return {
			addOrUpdateVisible: false, // 新增编辑弹窗
			tableSearch: [
				{
					type: 'daterange',
					label: '开单日期',
					key1: 'startDate',
					key2: 'endDate',
					format: 'yyyy-MM-dd',
					width: '130px',
				},
				{
					type: 'input',
					prepend: 'select',
					selectValue: 'name',
					width: '220px',
					options: [],
				},
				{
					type: 'input',
					prepend: 'select',
					selectValue: 'tel',
					width: '220px',
					options: [],
				},
			],
			tableColumns: [
				{ type: 'selection', fixed: 'left' },
				{ prop: 'name', label: '姓名' },
				{ prop: 'tel', label: '手机号码' },
				{ prop: 'age', label: '年龄' },
				{ prop: 'birth', label: '出生日期' },
				{ prop: 'email', label: '邮箱' },
				{ prop: 'address', label: '地址' },
			],
			dataForm: {},
			currentPage: 1,
			pageSize: 50,
			total: 0,
			dataList: [],
			tableSelection: [],
		};
	},
	created() {
		const optionList = this.tableColumns.filter((item) => item.prop);
		this.tableSearch[1].options = optionList;
		this.tableSearch[2].options = optionList;
		this.getDataList();
	},
	mounted() {
		this.$nextTick(() => {
			this.doLayout();
		});
	},
	activated() {
		this.$nextTick(() => {
			this.doLayout();
		});
	},
	methods: {
		getDataList(params) {
			pageList({
				...params,
				current: this.currentPage,
				size: this.pageSize,
			}).then(({ data }) => {
				console.log('data', data);
				this.total = data.total;
				this.dataList = data.records || [];
				this.doLayout();
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
				this.$refs.addOrUpdate.init(data);
			});
		},
		isSelectionOne() {
			if (this.tableSelection.length === 0) {
				this.$message.warning('请选择一条数据');
				return;
			}
			if (this.tableSelection.length !== 1) {
				this.$message.warning('只能操作单条数据');
				return;
			}
			return true;
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
		handleSelectionChange(selection) {
			this.tableSelection = selection;
		},
		doLayout() {
			this.$refs.table.doLayout(true);
		},
	},
};
</script>

<style lang="scss" scoped></style>
