export function getTableColumns(vm) {
	return [
		{ type: 'index', fixed: 'left' },
		{ label: '菜单名称', prop: 'name' },
		{ label: '菜单编号', prop: 'code' },
		{ label: '菜单排序', prop: 'sort' },
		{
			label: '菜单图标',
			prop: 'source',
			render(h, { cellValue }) {
				return <span class={cellValue}></span>;
			},
		},
		{
			type: 'operate',
			label: '操作',
			width: 180,
			render(h, { row }) {
				return (
					<div>
						{vm.getBtnAuth('topmenu.edit') && (
							<el-button
								type="primary"
								size="mini"
								onClick={() => vm.handleUpdate(row)}
							>
								编辑
							</el-button>
						)}
						{vm.getBtnAuth('topmenu.delete') && (
							<el-button
								type="danger"
								size="mini"
								onClick={() => vm.handleDelete(row)}
							>
								删除
							</el-button>
						)}
						{vm.getBtnAuth('topmenu.setting') && (
							<el-button size="mini" onClick={() => vm.handleConfig(row)}>
								配置
							</el-button>
						)}
					</div>
				);
			},
		},
	];
}
