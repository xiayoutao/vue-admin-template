export function getMainFormFields() {
	return [
		{
			type: 'upload',
			span: 12,
			label: '头像',
			prop: 'fileList',
			listType: 'picture-card',
			systemType: 'system',
			bizType: 'user',
			limit: 1,
		},
		{
			type: 'input',
			span: 12,
			label: '工号',
			prop: 'account',
			placeholder: '请填写工号',
		},
		{
			span: 12,
			type: 'input',
			label: '用户名称',
			prop: 'name',
			placeholder: '请填写用户名称',
		},
		{
			span: 12,
			type: 'selectTree',
			label: '所属部门',
			prop: 'deptId',
			placeholder: '请选择所属部门',
			dataType: 'store',
			dataSource: 'treeDept',
			parent: false, // 是否可以选择父级。默认true
			'expand-on-click-node': true,
		},
		{
			span: 12,
			type: 'input',
			label: '手机号码',
			prop: 'phone',
			placeholder: '请填写手机号码',
			rules: [
				{
					required: true,
					trigger: ['blur', 'change'],
					validator: (rule, value, callback) => {
						if (!value) {
							return callback(new Error('请输入手机号码'));
						} else if (
							!/^1[3456789]\d{9}$/.test(value) &&
							!/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value)
						) {
							return callback(new Error('请输入正确的手机号码!'));
						} else {
							callback();
						}
					},
				},
			],
		},
		{
			span: 12,
			type: 'input',
			label: '邮箱',
			prop: 'email',
			placeholder: '请填写邮箱',
		},
		{
			type: 'select',
			span: 12,
			label: '性别',
			prop: 'sex',
			dataType: 'dict',
			dataSource: 'sex',
			placeholder: '请选择性别',
		},
		{
			type: 'select',
			span: 12,
			label: '状态',
			prop: 'status',
			options: [
				{ label: '启用', value: 1 },
				{ label: '停用', value: 0 },
			],
		},
		// {
		// 	type: 'input',
		// 	span: 12,
		// 	label: '钉钉账号',
		// 	prop: 'dinkAccount',
		// },
		// {
		// 	type: 'select',
		// 	span: 12,
		// 	label: '接收用户消息',
		// 	prop: 'isReceiveOrder',
		// 	options: [
		// 		{ label: '是', value: 1 },
		// 		{ label: '否', value: 0 },
		// 	],
		// },
		// {
		// 	type: 'select',
		// 	span: 12,
		// 	label: '是否为业务员',
		// 	prop: 'key',
		// 	options: [
		// 		{ label: '是', value: 1 },
		// 		{ label: '否', value: 0 },
		// 	],
		// },
	];
}
