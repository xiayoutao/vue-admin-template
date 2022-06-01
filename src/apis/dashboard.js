import APIs from '.';
import request, { handle } from '@/utils/http';

export async function modelUse(params) {
	const res = await request({
		url: APIs.dashboard.modelUse,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}

export async function trainNumber(params) {
	const res = await request({
		url: APIs.dashboard.trainNumber,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}

export async function tireUse(params) {
	const res = await request({
		url: APIs.dashboard.tireUse,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}

export async function carUseCost(params) {
	const res = await request({
		url: APIs.dashboard.carUseCost,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}

export async function violation(params) {
	const res = await request({
		url: APIs.dashboard.violation,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}

export async function expireAlert(params) {
	const res = await request({
		url: APIs.dashboard.expireAlert,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}

export async function trainNumberCount(params) {
	const res = await request({
		url: APIs.dashboard.trainNumberCount,
		method: 'get',
		params,
	});
	return handle({
		...res,
	});
}
