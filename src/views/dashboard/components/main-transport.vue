<template>
	<div class="main-transport">
		<div class="item truck">
			<span class="value">{{ trouble }}票</span>
			<span class="label">运输事故</span>
		</div>
		<div class="item clock">
			<span class="value">{{ lateStart }}车</span>
			<span class="label">晚发车次</span>
		</div>
		<div class="item late">
			<span class="value">{{ lateArrive }}车</span>
			<span class="label">晚到车次</span>
		</div>
		<div class="item stop">
			<span class="value">{{ stop }}车</span>
			<span class="label">停留车次</span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		trouble: Number,
		lateStart: Number,
		lateArrive: Number,
		stop: Number,
	},
};
</script>

<style lang="scss" scoped>
.main-transport {
	@include flex-column('', center);
	width: 190px;
	height: 100%;

	.item {
		@include flex-column('', center);
		position: relative;
		box-sizing: border-box;
		height: 88px;
		margin: 12px 0;
		padding-left: 88px;
		&:before {
			position: absolute;
			top: 0;
			left: 0;
			display: block;
			width: 88px;
			height: 88px;
			background-repeat: no-repeat;
			background-position: center;
			background-size: 100%;
			content: '';
		}
		&.truck {
			color: #f2637b;
			&:before {
				background-image: url('/img/dashboard/truck.png');
			}
		}
		&.clock {
			color: #2cdedd;
			&:before {
				background-image: url('/img/dashboard/clock.png');
			}
		}
		&.late {
			color: #449cff;
			&:before {
				background-image: url('/img/dashboard/late.png');
			}
		}
		&.stop {
			color: #fbd437;
			&:before {
				background-image: url('/img/dashboard/stop.png');
			}
		}
		.value {
			margin-bottom: 5px;
			font-weight: 700;
			font-size: 22px;
		}
		.label {
			color: #fff;
			font-size: 16px;
		}
	}
}
</style>
