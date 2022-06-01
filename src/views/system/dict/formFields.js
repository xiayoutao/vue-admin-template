export function getFormFields() {
	return [
		{
			type: 'input',
			span: 24,
			label: '字典编码',
			prop: 'code',
			placeholder: '请填写字典编码',
			rules: [{ required: true, message: '请填写字典编码', trigger: 'blur' }],
		},
		{
			span: 12,
			type: 'input',
			label: '字典名称',
			prop: 'dictValue',
			placeholder: '请填写字典名称',
			rules: [{ required: true, message: '请填写字典名称', trigger: 'blur' }],
		},
		{
			type: 'input',
			span: 12,
			label: '字典键值',
			prop: 'dictKey',
			placeholder: '请填写字典键值',
			rules: [{ required: true, message: '请填写字典键值', trigger: 'blur' }],
		},
		{
			span: 12,
			type: 'inputNumber',
			label: '字典排序',
			prop: 'sort',
			placeholder: '请填写字典排序',
			rules: [{ required: true, message: `请填写字典排序`, trigger: 'change' }],
		},
		{
			type: 'select',
			span: 12,
			label: '是否封存',
			prop: 'isSealed',
			options: [
				{ label: '是', value: 1 },
				{ label: '否', value: 0 },
			],
		},
		{
			type: 'input',
			inputType: 'textarea',
			span: 24,
			label: '字典备注',
			prop: 'remark',
		},
	];
}
