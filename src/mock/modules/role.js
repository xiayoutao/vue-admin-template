import Mock from 'mockjs';
import APIs from '@/apis';
import { getUrlRegExp, getUrlParams, getPageData } from '../util';
import dataList from '../data/role';

export default ({ mock }) => {
	if (!mock) return;
	// 查询分页父级
	Mock.mock(getUrlRegExp(APIs.role.list), 'get', (options) => {
		const params = getUrlParams(options.url);
		console.log('params', params);

		return {
			code: 200,
			data: dataList,
		};
	});

	Mock.mock(getUrlRegExp(APIs.role.detail), 'get', (options) => {
		const params = getUrlParams(options.url);
		const { id } = params;
		return {
			code: 200,
			data: dataList.find((item) => item.id == id),
		};
	});
};
