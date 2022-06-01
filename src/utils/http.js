import axios from 'axios';
import { Message } from 'element-ui';
import NProgress from 'nprogress';
import router from '@/router';
import { serialize } from '@/utils/util';
import { getToken, removeToken, removeRefreshToken } from '@/utils/auth';
import { Base64 } from 'js-base64';

// 默认超时时间
const {
	VUE_APP_clientId, //
	VUE_APP_clientSecret,
	VUE_APP_tokenHeader,
} = process.env;

//返回其他状态码
axios.defaults.validateStatus = function (status) {
	return status >= 200 && status <= 500;
};

axios.defaults.timeout = 60000;
//跨域请求，允许保存cookie
axios.defaults.withCredentials = false;

//http request拦截
axios.interceptors.request.use(
	(config) => {
		NProgress.start();
		const meta = config.meta || {};
		const isToken = meta.isToken === false;
		config.headers['Authorization'] = `Basic ${Base64.encode(
			`${VUE_APP_clientId}:${VUE_APP_clientSecret}`,
		)}`;

		//让每个请求携带token
		if (getToken() && !isToken) {
			config.headers[VUE_APP_tokenHeader] = 'bearer ' + getToken();
		}
		//headers中配置text请求
		if (config.text === true) {
			config.headers['Content-Type'] = 'text/plain';
		}
		//headers中配置serialize为true开启序列化
		if (config.method === 'post' && meta.isSerialize === true) {
			config.data = serialize(config.data);
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// http response 拦截
axios.interceptors.response.use(
	(res) => {
		NProgress.done();
		//获取状态码
		const status = res.status;
		//如果是401则跳转到登录页面
		if (status === 401) {
			removeToken();
			removeRefreshToken();
			router.push({ path: '/login' });
		}
		// 如果请求为非200否者默认统一处理
		if (status !== 200) {
			return Promise.resolve(res);
		}
		return res;
	},
	(error) => {
		NProgress.done();
		return Promise.reject(error);
	},
);

/**
 * 处理接口返回数据
 * 统一处理成功的逻辑（避免项目中到处都是res.code === 200的判断）
 * @param {*} options
 */
export const handle = (options) => {
	const successCode = 200; // 正确的code值（返回数据）
	const res = Object.assign(
		{
			silent: false, // 是否静默处理（出现错误不提示）
			successCode, // 成功返回回调状态
			code: successCode, // 接口返回状态
			data: {}, // 请求接口回调数据
		},
		options.data,
	);
	return new Promise((resolve, reject) => {
		if (res.code === res.successCode) {
			resolve(res);
		} else {
			reject(res);
			if (!res.silent) {
				Message.closeAll();
				Message.error(res.msg);
			}
		}
	});
};

export default axios;
