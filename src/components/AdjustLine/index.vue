<template>
	<div
		class="adjust-line-wrapper adjust-line-wrapper-v"
		@mousedown="onMousedown"
	>
		<div class="adjust-line adjust-line-v"></div>
		<div class="adjust-button" :style="{ top: `${iconTop}px` }">
			<div class="indicator"></div>
		</div>
	</div>
</template>

<script>
/**
 * 如果要自定义默认颜色和鼠标经过颜色可以在组件节点增加style，如下
 * <adjust-line style="--default-color:#6390C6;--hover-color: #424d7e;"></adjust-line>
 */
export default {
	name: 'adjust-line',
	props: {
		iconTop: Number,
	},
	methods: {
		onMousedown(event) {
			let startX = event.clientX;
			let move = (moveEvent) => {
				moveEvent.preventDefault();
				moveEvent.stopPropagation();
				const offset = startX - moveEvent.clientX;
				this.$emit('line-move', offset);
				startX -= offset;
			};
			let up = () => {
				document.removeEventListener('mousemove', move, true);
				document.removeEventListener('mouseup', up, true);
			};
			document.addEventListener('mousemove', move, true);
			document.addEventListener('mouseup', up, true);
		},
	},
};
</script>

<style lang="scss" scoped>
.adjust-line-wrapper {
	--default-color: #bbb;
	--hover-color: #6390c6;

	&:hover {
		.adjust-button {
			background-color: var(--hover-color);
		}
		.adjust-line {
			border-color: var(--hover-color);
		}
	}
	.adjust-line {
		border: 1px solid var(--default-color);
	}
	.adjust-line-h {
		width: 100%;
	}
	.adjust-line-v {
		height: 100%;
	}
	.adjust-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 10px;
		margin: 0 auto;
		background-color: var(--default-color);

		.indicator {
			width: 10px;
			height: 1px;
			margin: 0 auto;
			background-color: #fff;
		}
	}
}
.adjust-line-wrapper-h {
	cursor: ns-resize;

	.adjust-tip {
		height: 24px;
		margin: 2px auto 0;
		padding: 0;
		color: #868484;
		font-size: 12px;
		line-height: 24px;
		letter-spacing: 1px;
		text-align: center;
		vertical-align: middle;
	}
}
.adjust-line-wrapper-v {
	position: relative;
	height: 100%;
	cursor: ew-resize;

	.adjust-button {
		position: absolute;
		top: 50%;
		right: -10px;
		transform: rotate(90deg);
	}
}
</style>