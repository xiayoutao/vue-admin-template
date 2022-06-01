export function getMainFormFields(vm) {
	return [
		{
			type: 'select',
			span: 6,
			label: '菜单类型',
			prop: 'category',
			options: [
				{ label: '菜单', value: 1 },
				{ label: '按钮', value: 2 },
			],
		},
		{
			type: 'input',
			span: 6,
			label: '菜单名称',
			prop: 'name',
			rules: [
				{
					required: true,
					message: '请输入菜单名称',
					trigger: 'blur',
				},
			],
		},
		{
			type: 'input',
			span: 6,
			label: '路由地址',
			prop: 'path',
			rules: [
				{
					required: true,
					message: '请输入路由地址',
					trigger: 'blur',
				},
			],
		},
		{
			type: 'input',
			span: 6,
			label: '文件路径',
			prop: 'file',
		},
		{
			type: 'selectTree',
			span: 6,
			label: '上级菜单',
			prop: 'parentId',
			treeProps: {
				children: 'children',
				label: 'title',
			},
			dataType: 'store',
			dataSource: 'treeMenu',
			rules: [
				{
					required: false,
					message: '请选择上级菜单',
					trigger: 'click',
				},
			],
		},
		{
			type: 'input',
			append: 'icon',
			appendIcon: '',
			span: 6,
			label: '菜单图标',
			prop: 'source',
			clearable: true,
			rules: [
				{
					required: false,
					message: '请输入菜单图标',
					trigger: 'click',
				},
			],
			events: {
				focus() {
					vm.menuIconVisible = true;
				},
			},
		},
		{
			type: 'input',
			span: 6,
			label: '菜单编号',
			prop: 'code',
			rules: [
				{
					required: true,
					message: '请输入菜单编号',
					trigger: 'blur',
				},
			],
		},
		{
			type: 'input',
			span: 6,
			label: '菜单别名',
			prop: 'alias',
			rules: [
				{
					required: true,
					message: '请输入菜单别名',
					trigger: 'blur',
				},
			],
		},
		{
			type: 'inputNumber',
			span: 6,
			label: '菜单排序',
			prop: 'sort',
			'controls-position': 'right',
			rules: [
				{
					required: true,
					message: '请输入菜单排序',
					trigger: 'blur',
				},
			],
		},
		{
			type: 'select',
			span: 6,
			label: '新窗口',
			prop: 'isOpen',
			defaultValue: 1,
			options: [
				{ label: '否', value: 1 },
				{ label: '是', value: 2 },
			],
		},
		{
			type: 'select',
			span: 6,
			label: '是否添加权限',
			prop: 'isButton',
			defaultValue: 0,
			options: [
				{ label: '是', value: 1 },
				{ label: '否', value: 0 },
			],
		},
		{
			type: 'input',
			inputType: 'textarea',
			span: 24,
			label: '菜单备注',
			prop: 'remark',
		},
	];
}
