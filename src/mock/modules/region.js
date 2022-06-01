import Mock from 'mockjs';
import APIs from '@/apis';
import { getUrlRegExp, getUrlParams, getPageData } from '../util';
import dataList from '../data/region';

export default ({ mock }) => {
	if (!mock) return;
	// 查询分页父级
	Mock.mock(getUrlRegExp(APIs.region.allTree), 'get', () => {
		return {
			code: 200,
			data: dataList,
		};
	});
};
