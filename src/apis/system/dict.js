import APIs from '..';
import request, { handle } from '@/utils/http';

export async function getList(current, size, params) {
	const res = await request({
		url: APIs.dict.list,
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

export async function getParentList(params) {
	const res = await request({
		url: APIs.dict.parentList,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}

export async function getChildList(params) {
	const res = await request({
		url: APIs.dict.childList,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}

export async function remove(ids) {
	const res = await request({
		url: APIs.dict.remove,
		method: 'post',
		data: {
			ids,
		},
	});
	return handle({
		...res,
	});
}

export async function add(row) {
	const res = await request({
		url: APIs.dict.submit,
		method: 'post',
		data: row,
	});
	return handle({
		...res,
	});
}

export async function update(row) {
	const res = await request({
		url: APIs.dict.submit,
		method: 'post',
		data: row,
	});
	return handle({
		...res,
	});
}

export async function getDict(id) {
	const res = await request({
		url: APIs.dict.detail,
		method: 'get',
		params: {
			id,
		},
	});
	return handle({
		...res,
	});
}

export async function getAllTreeDict() {
	const res = await request({
		url: APIs.dict.allTree,
		method: 'get',
	});
	return handle({
		...res,
	});
}

export async function getDictTree() {
	const res = await request({
		url: APIs.dict.tree + '?code=DICT',
		method: 'get',
	});
	return handle({
		...res,
	});
}

export async function getDictionary(params) {
	const res = await request({
		url: APIs.dict.dictionary,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}
