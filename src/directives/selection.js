/**
 * 选中文本
 */
export default {
	bind(el, options) {
		el.onclick = function () {
			const range = document.createRange();
			const selection = window.getSelection();
			range.selectNodeContents(el);
			selection.removeAllRanges();
			selection.addRange(range);
			if (options.arg === 'copy' && document.execCommand) {
				document.execCommand('Copy', true, null); // 复制选中的文本
			}
		};
	},
};
