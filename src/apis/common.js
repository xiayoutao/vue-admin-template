import APIs from '.';
import request, { handle } from '@/utils/http';

// 模拟
export async function mapJson(params) {
	const res = await request({
		url: APIs.common.map,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}
