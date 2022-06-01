import Mock from 'mockjs';
import APIs from '@/apis';
import { getUrlRegExp, getUrlParams, getPageData } from '../util';
import dataList from '../data/dept';

export default ({ mock }) => {
	if (!mock) return;
	// 查询分页父级
	Mock.mock(getUrlRegExp(APIs.dept.tree), 'get', () => {
		return {
			code: 200,
			data: dataList,
		};
	});
};
