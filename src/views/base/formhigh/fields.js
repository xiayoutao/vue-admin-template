export function getFields(vm) {
	return [
		{
			type: 'input',
			span: 6,
			label: '标题',
			prop: 'title',
			placeholder: '请输入标题',
			rules: [
				{
					required: true,
					message: '标题不能为空',
					trigger: 'blur',
				},
			],
			events: {
				enter(val) {
					console.log(1111, val);
				},
			},
		},
		{
			span: 6,
			type: 'input',
			label: '姓名',
			prop: 'name',
			placeholder: '请输入姓名',
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
			span: 6,
			label: '性别',
			prop: 'sex',
			placeholder: '请选择性别',
			dataType: 'dict',
			dataSource: 'sex',
		},
		{
			type: 'daterange',
			span1: 6,
			span2: 6,
			label1: '开始时间',
			label2: '结束时间',
			prop1: 'startDate',
			prop2: 'endDate',
			placeholder: '请选择日期',
			events: {
				change(val) {
					console.log(val);
				},
			},
		},
		{
			type: 'cascader',
			span: 6,
			label: '地区',
			prop: 'address',
			placeholder: '请选择省市区',
			dataType: 'store',
			dataSource: 'treeRegion',
		},
		{
			type: 'selectTree',
			span: 12,
			label: '自定义',
			prop: 'keys',
			dataType: 'store',
			dataSource: 'treeDept',
			parent: false, // 是否可以选择父级。默认true
			'expand-on-click-node': true,
		},
		{
			type: 'input',
			inputType: 'textarea',
			span: 24,
			label: '备注',
			prop: 'remark',
			placeholder: '请填写备注',
		},
		{
			type: 'upload',
			span: 24,
			label: '头像',
			prop: 'avatar',
			listType: 'picture-card',
			systemType: 'cvas', // 填写系统名
			bizType: 'demo', // 写页面名
			limit: 1,
		},
		{
			type: 'render',
			span: 24,
			label: '自定义',
			prop: 'keys',
			render() {
				const tableData = [
					{ demo1: 1, demo2: 2, demo3: 3 },
					{ demo1: 1, demo2: 2, demo3: 3 },
					{ demo1: 1, demo2: 2, demo3: 3 },
				];
				const tableColumns = [
					{ label: '示例1', prop: 'demo1' },
					{ label: '示例2', prop: 'demo2' },
					{
						label: '示例3',
						prop: 'demo3',
						children: [
							{ label: '示例1', prop: 'demo1' },
							{ label: '示例2', prop: 'demo2' },
						],
					},
				];
				return (
					<element-table
						data={tableData}
						columns={tableColumns}
					></element-table>
				);
			},
		},
		{
			type: 'upload',
			span: 24,
			label: '附件',
			prop: 'file',
			ref: 'file1',
			onProgress(file) {
				console.log(file);
			},
			onRemove(file, fileList) {
				console.log(file, fileList);
			},
		},
	];
}
