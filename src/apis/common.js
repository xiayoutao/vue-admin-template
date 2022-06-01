import APIs from '.';
import request, { handle } from '@/utils/http';

export async function car_info(params) {
	const res = await request({
		url: APIs.common.car_info,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}
