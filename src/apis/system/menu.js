import APIs from '..';
import request, { handle } from '@/utils/http';

export async function getList(params) {
	const res = await request({
		url: APIs.menu.list,
		method: 'get',
		params: {
			...params,
		},
	});
	return handle({
		...res,
	});
}

export async function getLazyList(params) {
	const res = await request({
		url: APIs.menu.lazyList,
		method: 'get',
		params: {
			...params,
		},
	});
	return handle({
		...res,
	});
}

export async function getLazyMenuList(parentId, params) {
	const res = await request({
		url: APIs.menu.lazyMenuList,
		method: 'get',
		params: {
			...params,
			parentId,
		},
	});
	return handle({
		...res,
	});
}

export async function getMenuList(current, size, params) {
	const res = await request({
		url: APIs.menu.menuList,
		method: 'get',
		params: {
			...params,
			current,
			size,
		},
	});
	return handle({
		...res,
	});
}

export async function getMenuTree(tenantId) {
	const res = await request({
		url: APIs.menu.tree,
		method: 'get',
		params: {
			tenantId,
		},
	});
	return handle({
		...res,
	});
}

export async function remove(ids) {
	const res = await request({
		url: APIs.menu.remove,
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
		url: APIs.menu.submit,
		method: 'post',
		data: row,
		loading: true,
	});
	return handle({
		...res,
	});
}

export async function update(row) {
	const res = await request({
		url: APIs.menu.submit,
		method: 'post',
		data: row,
		loading: true,
	});
	return handle({
		...res,
	});
}

export async function getMenu(id) {
	const res = await request({
		url: APIs.menu.detail,
		method: 'get',
		params: {
			id,
		},
	});
	return handle({
		...res,
	});
}

export async function getTopMenu() {
	const res = await request({
		url: APIs.menu.topMenu,
		method: 'get',
	});
	return handle({
		...res,
	});
}

export async function getRoutes(topMenuId) {
	const res = await request({
		url: APIs.menu.routes,
		method: 'get',
		params: {
			topMenuId,
		},
	});
	return handle({
		...res,
	});
}

export async function getButtons() {
	const res = await request({
		url: APIs.menu.buttons,
		method: 'get',
	});
	return handle({
		...res,
	});
}

export async function roleTreeKeys(roleIds) {
	const res = await request({
		url: APIs.menu.roleTreeKeys,
		method: 'get',
		params: {
			roleIds,
		},
	});
	return handle({
		...res,
	});
}

export async function grantTree() {
	const res = await request({
		url: APIs.menu.grantTree,
		method: 'get',
	});
	return handle({
		...res,
	});
}

export async function grantTopTree() {
	const res = await request({
		url: APIs.menu.grantTopTree,
		method: 'get',
	});
	return handle({
		...res,
	});
}

export async function getTopTree(topMenuIds) {
	const res = await request({
		url: APIs.menu.topTreeKeys,
		method: 'get',
		params: {
			topMenuIds,
		},
	});
	return handle({
		...res,
	});
}
