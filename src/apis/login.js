import APIs from '.';
import request, { handle } from '@/utils/http';

export async function loginByUsername(params) {
	const res = await request({
		url: APIs.auth.token,
		method: 'post',
		headers: {
			'Tenant-Id': params.tenantId,
			'Captcha-Key': params.key,
			'Captcha-Code': params.code,
		},
		data: {
			tenantId: params.tenantId,
			username: params.username,
			password: params.password,
			code: params.code,
			type: params.type,
			grant_type: 'captcha',
			scope: 'all',
		},
		loading: true,
	});
	return res;
}

export async function refreshToken(params) {
	const res = await request({
		url: APIs.auth.token,
		method: 'post',
		headers: {
			'Tenant-Id': params.tenantId,
		},
		data: {
			refresh_token: params.refresh_token,
			tenantId: params.tenantId,
			grant_type: 'refresh_token',
			scope: 'all',
		},
	});
	return res;
}

export async function logout() {
	const res = await request({
		url: APIs.auth.logout,
		method: 'get',
	});
	return handle({
		...res,
	});
}

export async function getCaptcha() {
	const res = await request({
		url: APIs.auth.captcha,
		method: 'get',
	});
	return handle({
		...res,
	});
}
