import APIs from '..';
import request, { handle } from '@/utils/http';

export async function getList(params) {
	const res = await request({
		url: APIs.user.page,
		method: 'get',
		params: params,
	});
	return handle({
		...res,
	});
}

export async function remove(ids) {
	const res = await request({
		url: APIs.user.remove,
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
		url: APIs.user.submit,
		method: 'post',
		data: row,
	});
	return handle({
		...res,
	});
}

export async function update(row) {
	const res = await request({
		url: APIs.user.update,
		method: 'post',
		data: row,
	});
	return handle({
		...res,
	});
}

export async function enable(id) {
	const res = await request({
		url: APIs.user.enable,
		method: 'post',
		data: {
			id,
		},
	});
	return handle({
		...res,
	});
}

export async function stop(id) {
	const res = await request({
		url: APIs.user.stop,
		method: 'post',
		data: {
			id,
		},
	});
	return handle({
		...res,
	});
}

export async function updatePlatform(userId, userType, userExt) {
	const res = await request({
		url: APIs.user.updatePlatform,
		method: 'post',
		data: {
			userId,
			userType,
			userExt,
		},
	});
	return handle({
		...res,
	});
}

export async function getUser(id) {
	const res = await request({
		url: APIs.user.detail,
		method: 'get',
		params: {
			id,
		},
	});
	return handle({
		...res,
	});
}

export async function getUserPlatform(id) {
	const res = await request({
		url: APIs.user.platformDetail,
		method: 'get',
		params: {
			id,
		},
	});
	return handle({
		...res,
	});
}

export async function getUserInfo() {
	const res = await request({
		url: APIs.user.info,
		method: 'get',
	});
	return handle({
		...res,
	});
}

export async function resetPassword(userIds) {
	const res = await request({
		url: APIs.user.resetPassword,
		method: 'post',
		params: {
			userIds,
		},
	});
	return handle({
		...res,
	});
}

export async function updatePassword(oldPassword, newPassword, newPassword1) {
	const res = await request({
		url: APIs.user.updatePassword,
		method: 'post',
		data: {
			oldPassword,
			newPassword,
			newPassword1,
		},
	});
	return handle({
		...res,
	});
}

export async function updateInfo(params) {
	const res = await request({
		url: APIs.user.updateInfo,
		method: 'post',
		data: params,
	});
	return handle({
		...res,
	});
}

export async function grant(params) {
	const res = await request({
		url: APIs.user.grant,
		method: 'post',
		params: params,
	});
	return handle({
		...res,
	});
}

export async function unlock(userIds) {
	const res = await request({
		url: APIs.user.unlock,
		method: 'post',
		data: {
			userIds,
		},
	});
	return handle({
		...res,
	});
}

export async function userDropDown(deptId) {
	const res = await request({
		url: APIs.user.userDropDown,
		method: 'get',
		params: {
			deptId,
		},
	});
	return handle({
		...res,
	});
}
