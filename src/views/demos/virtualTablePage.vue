<template>
	<div class="page-table">
		<virtual-table
			:datas="dataList"
			:columns="tableColumns"
			:calc-height="true"
			@on-params="handleParamChange"
			@on-sort="handleSortChange"
		>
			<template #search>
				<x-filters :config="tableSearch"></x-filters>
			</template>
			<template #toolbar>
				<el-button type="primary" icon="el-icon-plus">新增</el-button>
				<el-button icon="el-icon-plus" disabled>禁用</el-button>
				<el-button icon="el-icon-plus">禁用</el-button>
			</template>
			<template #pagination>
				<x-pagination
					:config="{ total: dataList.length }"
					@on-page="handlePageChange"
				></x-pagination>
			</template>
		</virtual-table>
	</div>
</template>

<script>
export default {
	name: 'virtualTablePage',
	data() {
		return {
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
					type: 'date',
					label: '创建日期',
					key: 'createDate',
					format: 'yyyy-MM-dd',
					width: '130px',
				},
				{
					type: 'input',
					prepend: 'select',
					key: 'key3',
					selectValue: 'title',
					width: '220px',
					options: [
						{ label: '标题', value: 'title' },
						{ label: '手机号', value: 'tel' },
					],
				},
				{
					type: 'input',
					prepend: 'select',
					key: 'key4',
					selectValue: 'tel',
					width: '220px',
					options: [
						{ label: '标题', value: 'title' },
						{ label: '手机号', value: 'tel' },
					],
				},
			],
			tableColumns: [
				{ type: 'selection', fixed: 'left' },
				{ prop: 'name', label: '姓名', sortable: true, fixed: 'left' },
				{ prop: 'tel', label: '手机号码' },
				{
					prop: 'email',
					label: '邮箱',
					sortable: true,
					filterCustom: true,
					filters: [{ label: '', data: '' }],
				},
				{
					prop: 'address',
					label: '地址',
					sortable: true,
					filters: [
						{ label: '家', value: '家' },
						{ label: '公司', value: '公司' },
					],
					filterMultiple: false,
					filterPlacement: 'bottom-end',
				},
			],
			dataList: new Array(1000).fill(0).map((item, index) => {
				return {
					id: index + 1,
					name: '',
					email: '',
					address: '',
					tel: '',
					avatar: '',
					car: new Array(Math.floor(Math.random() * 10) + 1).fill(0).map(() => {
						return {
							isDrive: Math.random() > 0.5, // 是否驱动
							isTurn: Math.random() > 0.5, // 是否转向
							isDouble: Math.random() > 0.5, // 是否双胎
							isRetread: Math.random() > 0.5, // 是否翻新
							tyreList: [],
						};
					}),
				};
			}),
			dataForm: {
				key: '1',
				keywords: null,
			},
		};
	},
	methods: {
		handleParamChange(params) {
			console.log('params', params);
		},
		handleSortChange(sort) {
			console.log('sort', sort);
		},
		handlePageChange({ type, current, size }) {
			if (type === 'current') {
				console.log('页码改变', current);
			} else if (type === 'size') {
				console.log('每页显示数目改变', size);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/ .elx-table .elx-body--column.table-column {
	height: 70px;

	> .elx-cell {
		max-height: none;
	}
}
</style>
