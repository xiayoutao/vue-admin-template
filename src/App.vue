<template>
	<router-view />
</template>

<script>
export default {
	name: 'App',
	created() {
		// 监听页面显示
		window.addEventListener('pageshow', (event) => {
			// event.persisted：从缓存获取数据时为true，否则为false
			// window.performance.navigation.type 如果用户通过浏览器后退访问的页面 则值为2
			if (
				event.persisted ||
				(window.performance && window.performance.navigation.type === 2)
			) {
				window.location.reload(true); // 刷新页面
			}
		});
	},
};
</script>

<style lang="scss">
@import './styles/global.scss'; // 全局
@import './styles/transition.scss'; // 动画
@import './styles/scrollbar.scss'; // 滚动条
@import './styles/contextmenu.scss'; // 右键菜单
</style>
