<template>
	<div class="chart-box">
		<div class="chart" :id="chartId"></div>
	</div>
</template>

<script>
import echarts from '@/utils/echarts';
import { debounce } from '@/utils/util';
import { loadingOption } from './vars';

export default {
	props: {
		id: {
			type: String,
			default: 'chart',
		},
		zoom: Number,
		option: Object,
	},
	data() {
		return {
			myChart: null,
		};
	},
	computed: {
		chartId() {
			return `${this.id}_${new Date().getTime()}`;
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.init(this.option);
		});
		window.addEventListener('resize', this.resize);
	},
	activated() {
		this.$nextTick(() => {
			this.init(this.option);
		});
		window.addEventListener('resize', this.resize);
	},
	deactivated() {
		window.removeEventListener('resize', this.resize);
		this.myChart && this.myChart.clear();
	},
	methods: {
		init(option) {
			option = JSON.parse(JSON.stringify(option));
			if (!option) {
				this.$emit('on-error', '参数未传递');
				return;
			}
			// 基于准备好的dom，初始化echarts实例
			this.initMap(option);
		},
		async initMap(option) {
			if (this.myChart) {
				this.myChart.setOption(option);
				return;
			}
			this.myChart = echarts.init(document.getElementById(this.chartId));
			this.myChart.showLoading({
				...loadingOption,
				maskColor: '#122034',
			});
			await this.sleep(1000);
			this.myChart.setOption(option);
			this.$emit('on-loaded');
			this.myChart.hideLoading();
		},
		registerMap(map) {
			echarts.registerMap('china', map);
			this.$nextTick(() => {
				this.init(this.option);
			});
		},
		resize: debounce(function () {
			window.removeEventListener('resize', this.resize);
			if (!this.myChart) return;
			this.myChart.resize();
		}, 50),
	},
	watch: {
		option: {
			handler(val) {
				this.init(val);
			},
			deep: true,
		},
	},
};
</script>

<style scoped>
.chart-box {
	position: relative;
	width: 100%;
	height: 100%;
}
.chart {
	width: 100%;
	height: 100%;
}
</style>
