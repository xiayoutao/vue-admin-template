export function getTableColumns(vm) {
	return [
		{ prop: 'dictValue', label: '字典名称' },
		{ prop: 'code', label: '字典编号' },
		{ prop: 'remark', label: '字典备注' },
		{ prop: 'sort', label: '字典排序' },
		{
			prop: 'isSealed',
			label: '状态',
			render(h, { cellValue }) {
				return (
					<span style={{ color: cellValue === 1 ? 'rgb(245, 108, 108)' : '' }}>
						{cellValue === 1 ? '封存' : '启用'}
					</span>
				);
			},
		},
		{
			label: '操作',
			width: 200,
			type: 'operate',
			render(h, { row }) {
				return (
					<div>
						{vm.getBtnAuth('dict.edit') && (
							<el-button
								type="primary"
								size="mini"
								onClick={() => vm.handleUpdate(row)}
							>
								编辑
							</el-button>
						)}
						{vm.getBtnAuth('dict.delete') && (
							<el-button
								type="danger"
								size="mini"
								onClick={() => vm.handleDelete(row)}
							>
								删除
							</el-button>
						)}
						<el-button
							type="success"
							size="mini"
							onClick={() => vm.handleConfig(row)}
						>
							字典配置
						</el-button>
					</div>
				);
			},
		},
	];
}
