import APIs from '..';
import request, { handle } from '@/utils/http';

export async function getDeptTree(tenantId) {
	const res = await request({
		url: APIs.dept.tree,
		method: 'get',
		params: {
			tenantId,
		},
	});
	return handle({
		...res,
	});
}
