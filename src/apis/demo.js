import APIs from '.';
import request, { handle } from '@/utils/http';

export async function pageList(params) {
	const res = await request({
		url: APIs.demos.page,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}
