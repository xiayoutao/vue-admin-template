import APIs from '..';
import request, { handle } from '@/utils/http';

export async function getList(params) {
	const res = await request({
		url: APIs.topmenu.list,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}

export async function getDetail(id) {
	const res = await request({
		url: APIs.topmenu.detail,
		method: 'get',
		params: {
			id,
		},
	});
	return handle({
		...res,
	});
}

export async function remove(ids) {
	const res = await request({
		url: APIs.topmenu.remove,
		method: 'post',
		params: {
			ids,
		},
	});
	return handle({
		...res,
	});
}

export async function add(row) {
	const res = await request({
		url: APIs.topmenu.submit,
		method: 'post',
		data: row,
	});
	return handle({
		...res,
	});
}

export async function update(row) {
	const res = await request({
		url: APIs.topmenu.submit,
		method: 'post',
		data: row,
	});
	return handle({
		...res,
	});
}

export async function grant(topMenuIds, menuIds) {
	const res = await request({
		url: APIs.topmenu.grant,
		method: 'post',
		data: {
			topMenuIds,
			menuIds,
		},
	});
	return handle({
		...res,
	});
}
