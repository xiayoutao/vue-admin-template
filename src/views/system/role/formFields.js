export function getMainFormFields() {
	return [
		{
			type: 'input',
			span: 12,
			label: '角色名称',
			prop: 'roleName',
			rules: [
				{
					required: true,
					message: '请输入角色名称',
					trigger: 'blur',
				},
			],
		},
		{
			type: 'input',
			span: 12,
			label: '角色别名',
			prop: 'roleAlias',
			rules: [
				{
					required: true,
					message: '请输入角色别名',
					trigger: 'blur',
				},
			],
		},
		{
			type: 'select',
			span: 12,
			label: '状态',
			prop: 'status',
			options: [
				{ label: '启用', value: 1 },
				{ label: '禁用', value: 0 },
			],
		},
	];
}
