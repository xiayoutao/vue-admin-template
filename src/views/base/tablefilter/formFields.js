export function getMainFormFields() {
	return [
		{
			type: 'input',
			span: 12,
			label: '姓名',
			prop: 'name',
			rules: [
				{
					required: true,
					message: '姓名不能为空',
					trigger: 'blur',
				},
			],
		},
		{
			type: 'select',
			span: 12,
			label: '性别',
			prop: 'sex',
			options: [
				{ label: '男', value: 1 },
				{ label: '女', value: 2 },
			],
			placeholder: '请选择性别',
		},
		{
			type: 'date',
			span: 12,
			label: '出生日期',
			prop: 'birth',
			placeholder: '请选择出生日期',
		},
		{
			type: 'input',
			span: 12,
			label: '手机号码',
			prop: 'tel',
			placeholder: '请输入手机号码',
		},
		{
			type: 'input',
			span: 12,
			label: '邮箱',
			prop: 'email',
			placeholder: '请输入邮箱',
		},
		{
			type: 'cascader',
			span: 12,
			label: '省市区',
			prop: 'address',
			placeholder: '请选择省市区',
			dataType: 'store',
			dataSource: 'treeRegion',
		},
	];
}
