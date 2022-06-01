import Mock from 'mockjs';
import APIs from '@/apis';
import { getUrlRegExp, getUrlParams, getPageData } from '../util';
import userList from '../data/user';

export default ({ mock }) => {
	if (!mock) return;
	// 查询分页父级
	Mock.mock(getUrlRegExp(APIs.user.page), 'get', (options) => {
		const params = getUrlParams(options.url);
		let { current, size } = params;
		current = current - 0;
		size = size - 0;
		const list = getPageData(userList, current, size);

		return {
			code: 200,
			data: {
				current,
				size,
				total: userList.length,
				records: list,
			},
		};
	});

	Mock.mock(getUrlRegExp(APIs.user.detail), 'get', (options) => {
		const params = getUrlParams(options.url);
		const { id } = params;
		return {
			code: 200,
			data: userList.find((item) => item.id == id),
		};
	});
};
