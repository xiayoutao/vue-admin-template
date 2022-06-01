import Mock from 'mockjs';
import APIs from '@/apis';
import { getUrlRegExp, getUrlParams, getPageData } from '../util';

const data = Mock.mock({
	'list|30-200': [
		{
			'id|+1': 1,
			name: '@cname(3)',
			tel: /^1(3|5|7|8|9)\d{9}$/,
			email: /^([a-zA-Z0-9])+@(qq|sina|163|126|soho)\.com$/,
			'age|1-100': 1,
			'sex|1-2': 1,
			birth: '@date("yyyy-MM-dd")',
			address: '@county(true)',
		},
	],
});

export default ({ mock }) => {
	if (!mock) return;
	// 查询分页父级
	Mock.mock(getUrlRegExp(APIs.demos.page), 'get', (options) => {
		const params = getUrlParams(options.url);
		let { current, size } = params;
		current = current - 0;
		size = size - 0;
		const list = getPageData(data.list, current, size);

		return {
			code: 200,
			data: {
				current,
				size,
				total: data.list.length,
				records: list,
			},
		};
	});
};
