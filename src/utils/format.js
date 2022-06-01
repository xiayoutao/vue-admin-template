/**
 * 去除字符串中的空格
 * @param {*} string
 * @returns
 */
export function trim(string) {
	return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

/**
 * 将字符串转为驼峰，通过 - _ . 符号
 * @param {*} str
 * @returns
 */
export function camelCase(str) {
	return str.replace(
		/([\\-\\_]+(.))/g,
		function (_, separator, letter, offset) {
			return offset ? letter.toUpperCase() : letter;
		},
	);
}

// 对日期填充，小于10的数字 前面填充0
export function toFillDate(num) {
	return num >= 10 ? num : '0' + num;
}

/**
 * 保存小数位
 * @param {*} num 要处理的值
 * @param {*} digit 保留几位小数
 * @returns
 */
export function toFixed(num, digit = 0) {
	// 下面这几种情况直接返回空字符串
	if (num === '' || num === null || num === undefined || isNaN(num)) return '';
	if (num - 0 === 0) return 0;
	return Number(num).toFixed(digit);
}

/**
 * 手机号脱敏处理。这里不校验手机号码是否正确，只要显示前3位和末4位 中间全部用*替换
 * @param {*} val 手机号码
 * @returns
 */
export function phoneHide(val = '') {
	return val.toString().replace(/(\d{3})\d*(\d{4})/, '$1****$2');
}

// 数字千分位格式化
export function formatNumber(str) {
	str = str + '';
	return str.replace(/\d{1,3}(?=(\d{3})+$)/g, ($1) => ($1 = $1 + ','));
}
