export default {
	inserted(el, binding) {
		el.addEventListener('click', () => {
			if (!el.disabled) {
				el.disabled = true; // disabled属性对button按钮有效，可以阻止点击事件触发
				el.classList.add('is-disabled'); // 这个class值得pointer-events: none可以阻止普通元素触发点击事件
				el.classList.add('isdisabled');
				setTimeout(() => {
					el.disabled = false;
					el.classList.remove('is-disabled');
					el.classList.remove('isdisabled');
				}, binding.value || 1000);
			}
		});
	},
};
