<template>
	<div class="card-main">
		<span class="angle top-left"></span>
		<span class="angle top-right"></span>
		<span class="angle bottom-left"></span>
		<span class="angle bottom-right"></span>
		<div class="card-inner">
			<div class="item" v-for="(item, index) in list" :key="index">
				<span class="label">{{ item.label }}</span>
				<span class="value">{{ item.value }}</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		list: Array,
	},
};
</script>

<style lang="scss" scoped>
.card-main {
	position: relative;
	flex: 1;
	margin: 0 9px;
	padding: 6px;

	.angle {
		position: absolute;
		width: 21px;
		height: 24px;
		background: url('/img/dashboard/bend-angle.png') no-repeat center;
		background-size: 100%;

		&.top-left {
			top: -1px;
			left: -1px;
		}
		&.top-right {
			top: -1px;
			right: -1px;
			transform: rotate(90deg);
		}
		&.bottom-left {
			bottom: -1px;
			left: -1px;
			transform: rotate(-90deg);
		}
		&.bottom-right {
			right: -1px;
			bottom: -1px;
			transform: rotate(180deg);
		}
	}

	.card-inner {
		height: 128px;
		border: 2px solid #0060a6;
		border-radius: 10px;
		background: rgba(6, 39, 78, 0.75);

		.item {
			@include flex-row(center, space-between);
			padding: 0 20px;
			.label {
				color: #fff;
				font-size: 18px;
				white-space: nowrap;
			}
			.value {
				color: #ffe400;
				font-weight: 700;
				font-size: 28px;
			}
		}
	}
}
</style>
