/* eslint-disable no-unused-vars */
import Mock from 'mockjs';
import APIs from '@/apis';
import { getUrlRegExp, getUrlParams, getPageData } from '../util';

export default ({ mock }) => {
	if (!mock) return;

	Mock.mock(getUrlRegExp(APIs.dashboard.trainNumberCount), 'get', () => {
		return {
			code: 200,
			data: {
				todayAddCount: 1,
				todayStartCount: 22,
				todayOutCount: 15,
				startCount: 110,
				onWayCount: 20,
				arriveCount: 50,
				monthTotal: 200,
				monthCompleteCount: 180,
				monthOutCount: 90,
			},
		};
	});

	Mock.mock(getUrlRegExp(APIs.dashboard.modelUse), 'get', () => {
		return {
			code: 200,
			data: [
				{ type: 'truck', total: 143, use: 85, free: 93, repair: 6 },
				{ type: 'trailer', total: 133, use: 73, free: 55, repair: 2 },
				{ type: 'tractor', total: 96, use: 65, free: 82, repair: 1 },
				{ type: 'business', total: 152, use: 53, free: 39, repair: 4 },
			],
		};
	});

	Mock.mock(getUrlRegExp(APIs.dashboard.trainNumber), 'get', () => {
		return {
			code: 200,
			data: [
				{
					des: '广州区域',
					strip: 200,
				},
				{
					des: '义乌区域',
					strip: 160,
				},
				{
					des: '深圳区域',
					strip: 800,
				},
				{
					des: '其他区域',
					strip: 300,
				},
			],
		};
	});

	Mock.mock(getUrlRegExp(APIs.dashboard.tireUse), 'get', () => {
		return {
			code: 200,
			data: [
				{
					des: '广州仓库',
					strip: 200,
				},
				{
					des: '义乌仓库',
					strip: 160,
				},
				{
					des: '已安装',
					strip: 800,
				},
				{
					des: '已处置',
					strip: 300,
				},
			],
		};
	});

	Mock.mock(getUrlRegExp(APIs.dashboard.carUseCost), 'get', () => {
		return {
			code: 200,
			data: {
				outcarFee: 1562,
				oilFee: 1080,
				bridgeFee: 536,
				foodFee: 365,
				otherFee: 180,
			},
		};
	});

	Mock.mock(getUrlRegExp(APIs.dashboard.violation), 'get', () => {
		return {
			code: 200,
			data: [
				{ type: 'total', count: 152, points: 66, amount: 1500 },
				{ type: 'scene', count: 45, points: 24, amount: 600 },
				{ type: 'electron', count: 36, points: 32, amount: 900 },
			],
		};
	});

	Mock.mock(getUrlRegExp(APIs.dashboard.expireAlert), 'get', () => {
		return {
			code: 200,
			data: [
				{ type: '7天', insurance: 152, driving: 66, operating: 200 },
				{ type: '15天', insurance: 145, driving: 124, operating: 150 },
				{ type: '30天', insurance: 236, driving: 132, operating: 90 },
			],
		};
	});
};
