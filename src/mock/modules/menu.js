import Mock from 'mockjs';
import APIs from '@/apis';
import { deepChangeKey } from '@/utils/util';
import { getUrlRegExp, getUrlParams, getPageData } from '../util';
import { topMenuList, menuList, menuButtons } from '../data/menu';

export default ({ mock }) => {
	if (!mock) return;
	// 分页查询
	Mock.mock(getUrlRegExp(APIs.menu.page), 'get', (options) => {
		const params = getUrlParams(options.url);
		let { current, size } = params;
		current = current - 0;
		size = size - 0;
		const list = getPageData(menuList, current, size);

		return {
			code: 200,
			data: {
				current,
				size,
				total: menuList.length,
				records: list,
			},
		};
	});

	Mock.mock(getUrlRegExp(APIs.menu.lazyList), 'get', () => {
		return {
			code: 200,
			data: menuList,
		};
	});

	Mock.mock(getUrlRegExp(APIs.menu.grantTree), 'get', () => {
		return {
			code: 200,
			data: {
				apiScope: [],
				dataScope: [],
				menu: deepChangeKey(menuList, {
					title: 'name',
					value: 'id',
				}),
			},
		};
	});

	Mock.mock(getUrlRegExp(APIs.menu.roleTreeKeys), 'get', (options) => {
		const params = getUrlParams(options.url);
		const { id } = params;
		return {
			code: 200,
			data: menuList.find((item) => item.id == id),
		};
	});

	Mock.mock(getUrlRegExp(APIs.menu.detail), 'get', (options) => {
		const params = getUrlParams(options.url);
		const { id } = params;
		return {
			code: 200,
			data: menuList.find((item) => item.id == id),
		};
	});

	Mock.mock(getUrlRegExp(APIs.menu.tree), 'get', () => {
		return {
			code: 200,
			data: menuList,
		};
	});

	Mock.mock(getUrlRegExp(APIs.menu.routes), 'get', (options) => {
		const params = getUrlParams(options.url);
		const { topMenuId } = params;
		return {
			code: 200,
			data: topMenuId
				? menuList.filter((item) => item.system == topMenuId) || []
				: menuList,
			msg: '',
		};
	});

	Mock.mock(getUrlRegExp(APIs.menu.buttons), 'get', () => {
		return {
			code: 200,
			data: menuButtons,
			msg: '',
		};
	});

	Mock.mock(getUrlRegExp(APIs.menu.topMenu), 'get', () => {
		return {
			code: 200,
			data: topMenuList,
		};
	});
};
