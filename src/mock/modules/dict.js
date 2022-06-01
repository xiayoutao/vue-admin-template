import Mock from 'mockjs';
import APIs from '@/apis';
import { getUrlRegExp, getUrlParams, getPageData } from '../util';
import { dictList } from '../data/dict';

export default ({ mock }) => {
	if (!mock) return;
	// 查询分页父级
	Mock.mock(getUrlRegExp(APIs.dict.parentList), 'get', (options) => {
		const params = getUrlParams(options.url);
		let { current, size } = params;
		current = current - 0;
		size = size - 0;
		const list = getPageData(dictList, current, size);

		return {
			code: 200,
			data: {
				current,
				size,
				total: dictList.length,
				records: list,
			},
		};
	});
	// 子级
	Mock.mock(getUrlRegExp(APIs.dict.childList), 'get', (options) => {
		const params = getUrlParams(options.url);
		let { parentId } = params;
		console.log('parentId', parentId);
		const obj = dictList.find((item) => item.id == parentId) || {};
		return {
			code: 200,
			data: obj.children || [],
		};
	});

	Mock.mock(getUrlRegExp(APIs.dict.allTree), 'get', () => {
		return {
			code: 200,
			data: dictList,
		};
	});
};
