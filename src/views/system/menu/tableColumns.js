export function getTableColumns() {
	return [
		{
			type: 'selection',
		},
		{
			label: '菜单名称',
			prop: 'name',
		},
		{
			label: '路由地址',
			prop: 'path',
		},
		{
			label: '菜单图标',
			prop: 'source',
			type: 'icon',
		},
		{
			label: '菜单编号',
			prop: 'code',
		},
		{
			label: '菜单类型',
			prop: 'category',
			type: 'radio',
		},
		{
			label: '菜单别名',
			prop: 'alias',
		},
		{
			label: '新窗口',
			prop: 'isOpen',
			type: 'radio',
			disabled: false,
		},
		{
			label: '菜单排序',
			prop: 'sort',
			type: 'number',
			span: 24,
		},
		{
			label: '菜单备注',
			prop: 'remark',
			type: 'textarea',
			span: 24,
		},
	];
}
