/* eslint-disable no-unused-vars */
import Mock from 'mockjs';
import APIs from '@/apis';
import { getUrlRegExp, getUrlParams, getPageData } from '../util';
import chinaJson from '../data/china.json';

export default ({ mock }) => {
	if (!mock) return;

	Mock.mock(getUrlRegExp(APIs.common.map), 'get', () => {
		return {
			code: 200,
			data: chinaJson,
		};
	});
};
