export function getFormFields() {
	return [
		{
			type: 'input',
			span: 24,
			label: '父区划编号',
			prop: 'parentCode',
			placeholder: '请输入父区划编号',
			rules: [
				{ required: true, message: '请输入父区划编号', trigger: 'change' },
			],
		},
		{
			span: 24,
			type: 'input',
			label: '父区划名称',
			prop: 'parentName',
			placeholder: '请输入父区划名称',
			rules: [
				{ required: true, message: '请输入父区划名称', trigger: 'change' },
			],
		},
		{
			span: 24,
			type: 'input',
			label: '区划子编号',
			prop: 'subCode',
			placeholder: '请输入区划子编号',
			rules: [{ required: true, message: `请输入区划子编号`, trigger: 'blur' }],
		},
		{
			span: 24,
			type: 'input',
			label: '区划名称',
			prop: 'name',
			placeholder: '请输入区划名称',
			rules: [{ required: true, message: `请输入区划名称`, trigger: 'blur' }],
		},
		{
			type: 'radios',
			span: 24,
			label: '区划等级',
			prop: 'regionLevel',
			options: [
				{ value: '0', label: '国家' },
				{ value: '1', label: '省份/直辖市' },
				{ value: '2', label: '地市' },
				{ value: '3', label: '区县' },
				{ value: '4', label: '乡镇' },
				{ value: '5', label: '村委' },
			],
		},
		{
			type: 'inputNumber',
			span: 24,
			label: '区划排序',
			prop: 'sort',
		},
		{
			type: 'input',
			inputType: 'textarea',
			span: 24,
			label: '区划备注',
			prop: 'remark',
		},
	];
}
