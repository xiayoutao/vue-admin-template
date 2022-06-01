import { isObject } from 'lodash';
import { isEmptyObject } from './types';

export function sleep(time = 0) {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
}

/**
 * 对象是否存在某个属性
 * @param {*} obj
 * @param {*} key
 * @returns
 */
export function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

// 判断2个对象是否一致
export function isObjectEqual(obj1, obj2) {
	return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * 函数节流
 * 减少函数的触发频率
 * @param {*} fn
 * @param {*} interval
 */
export function throttle(fn, interval) {
	var enterTime = 0; // 触发的时间
	var gapTime = interval || 200; // 间隔时间，如果interval不传，则默认200ms
	return function () {
		var context = this;
		var backTime = new Date(); // 第一次函数return即触发的时间
		if (backTime - enterTime > gapTime) {
			fn.call(context, arguments);
			enterTime = backTime; // 赋值给第一次触发的时间，这样就保存了第二次触发的时间
		}
	};
}

/**
 * 函数防抖
 * 延迟函数执行
 * @param {*} fn
 * @param {*} interval
 */
export function debounce(fn, interval) {
	var timer;
	var gapTime = interval || 200; // 间隔时间，如果interval不传，则默认200ms
	return function () {
		clearTimeout(timer);
		var context = this;
		var args = arguments; // 保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
		timer = setTimeout(function () {
			fn.call(context, args);
		}, gapTime);
	};
}

/**
 * 根据对象的路径查找值
 * @param {*} path 路径，如a.b.c
 * @param {*} obj 对象
 * @param {*} defaultValue 如果没有找到返回的默认值
 */
export function getObjectByPath(path, obj, defaultValue = undefined) {
	const paths = path.split('.');
	let currentObj = obj;
	for (let i = 0, len = paths.length; i < len; i++) {
		const item = paths[i];
		if (isObject(currentObj) && item in currentObj) {
			currentObj = currentObj[item];
		} else {
			currentObj = defaultValue;
		}
	}
	return currentObj;
}

/**
 * 数组去重
 * @param {*} dataList 要去重的对象数组
 * @param {*} key 根据key值去重
 * @returns
 */
export function getArrayUnique(dataList, key) {
	let keys = [];
	let returnList = [];
	dataList.forEach((item) => {
		if (keys.indexOf(item[key]) < 0) {
			// 如果值不存在
			keys.push(item[key]);
			returnList.push(item);
		}
	});
	return returnList;
}

//表单序列化
export const serialize = (data) => {
	let list = [];
	Object.keys(data).forEach((ele) => {
		list.push(`${ele}=${data[ele]}`);
	});
	return list.join('&');
};

/**
 * 获取url参数
 * @param name 参数名
 */
export function getQueryString(name) {
	let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	let r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(decodeURI(r[2]));
	return null;
}

// 将字符串转为对象 如 ?a=1&b=2  -> {a:1,b:2}
export function formatQueryString(str = '') {
	if (str.indexOf('?') === 0) {
		str = str.replace('?', ''); // 去掉第一个 ?
	}
	return str
		.trim()
		.split('&')
		.reduce(function (a, b) {
			var i = b.split('=');
			a[i[0]] = i[1];
			return a;
		}, {});
}

// 深拷贝数据，并改变字段
export function deepChangeKey(arr = [], keys = {}) {
	const isNullKeys = isEmptyObject(keys);
	return arr.map((item) => {
		let data = {
			...item,
		};
		if (!isNullKeys) {
			Object.keys(keys).forEach((key) => {
				data[key] = data[keys[key]];
			});
		}
		if (item.children && item.children.length > 0) {
			data.children = deepChangeKey(item.children);
		}
		return data;
	});
}

/**
 * 饿了么表格组件汇总方法
 * @param {Object}
 * label 文字
 * keys 需要合计的字段
 * columns和data是饿了么表格组件返回的
 * countKeys 统计数目的字段
 * @returns
 */
export function tableSummary({
	label = '汇总',
	keys,
	columns,
	data,
	showDigit = 2,
	countKeys = [],
}) {
	const sums = [];
	columns.forEach((column, index) => {
		if (index === 0) {
			sums[index] = label;
			return;
		}
		let values = [];
		data.forEach((item) => {
			if (!item.$filter) {
				values.push(Number(item[column.property]));
			}
		});
		if (
			keys.includes(column.property) &&
			!countKeys.includes(column.property)
		) {
			sums[index] = values.reduce((prev, curr) => {
				const value = Number(curr);
				if (!isNaN(value)) {
					return (prev + curr).toFixed(showDigit) - 0;
				} else {
					return prev.toFixed(showDigit) - 0;
				}
			}, 0);
		} else if (countKeys.includes(column.property)) {
			sums[index] = values.length;
		} else {
			sums[index] = '';
		}
	});
	return sums;
}

/**
 * 校验饿了么表单数据
 * @param {*} domRef 表单ref
 * @param {Object} rules 校验规则
 * @returns 错误提示数组
 */
export function validateField(domRef, rules) {
	let errorMsg = [];
	domRef.validateField(Object.keys(rules), (err) => {
		if (err) {
			// 有误
			errorMsg.push(err);
		}
	});
	return errorMsg;
}
