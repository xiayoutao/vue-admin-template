export function getTableColumns() {
	return [
		{ type: 'selection', fixed: 'left' },
		{ prop: 'account', label: '工号' },
		{ prop: 'name', label: '用户名称' },
		{ prop: 'phone', label: '手机号码' },
		{ prop: 'email', label: '电子邮箱' },
		{ prop: 'deptName', label: '所属部门' },
		{ prop: 'roleName', label: '所属角色' },
		// { prop: 'dinkAccount', label: '钉钉账号' },
		{
			prop: 'status',
			label: '状态',
			render(h, { cellValue }) {
				if (cellValue === 1) {
					return <span>启用</span>;
				}
				return <span>禁用</span>;
			},
		},
	];
}
