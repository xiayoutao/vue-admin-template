import APIs from '..';
import request, { handle } from '@/utils/http';

export async function getList(params) {
	const res = await request({
		url: APIs.role.list,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}

export async function grant({ roleIds, menuIds, dataScopeIds, apiScopeIds }) {
	const res = await request({
		url: APIs.role.grant,
		method: 'post',
		data: {
			roleIds,
			menuIds,
			dataScopeIds,
			apiScopeIds,
		},
	});
	return handle({
		...res,
	});
}

export async function remove(ids) {
	const res = await request({
		url: APIs.role.remove,
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
		url: APIs.role.submit,
		method: 'post',
		data: row,
	});
	return handle({
		...res,
	});
}

export async function update(row) {
	const res = await request({
		url: APIs.role.submit,
		method: 'post',
		data: row,
	});
	return handle({
		...res,
	});
}

export async function stop(row) {
	const res = await request({
		url: APIs.role.stop,
		method: 'post',
		data: row,
	});
	return handle({
		...res,
	});
}

export async function getDetail(id) {
	const res = await request({
		url: APIs.role.detail,
		method: 'get',
		params: {
			id,
		},
	});
	return handle({
		...res,
	});
}

export async function getRoleTree(tenantId) {
	const res = await request({
		url: APIs.role.tree,
		method: 'get',
		params: {
			tenantId,
		},
	});
	return handle({
		...res,
	});
}

export async function getRoleTreeById(roleId) {
	const res = await request({
		url: APIs.role.treeById,
		method: 'get',
		params: {
			roleId,
		},
	});
	return handle({
		...res,
	});
}
