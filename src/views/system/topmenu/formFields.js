export function getMainFormFields(vm) {
	return [
		{
			type: 'input',
			span: 12,
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
			append: 'icon',
			appendIcon: '',
			span: 12,
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
			span: 12,
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
			type: 'inputNumber',
			span: 12,
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
	];
}
