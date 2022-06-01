import APIs from '..';
import request, { handle } from '@/utils/http';

export async function getTree() {
	const res = await request({
		url: APIs.region.allTree,
		method: 'get',
	});
	return handle({
		...res,
	});
}
