<template>
	<div class="chart-box">
		<div class="chart" :id="chartId"></div>
	</div>
</template>

<script>
import echarts from '@/utils/echarts';
import { debounce } from '@/utils/util';
import chinaJson from '@/utils/china.json';

const points = [
	{
		value: [120.0744, 29.30558],
		itemStyle: { color: '#4a02e5' },
	},
	{
		value: [113.23333, 23.16667],
		itemStyle: { color: '#1fb6d2' },
	},
];

export default {
	props: {
		id: {
			type: String,
			default: 'chart',
		},
		options: Object,
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
	created() {
		echarts.registerMap('china', chinaJson, {
			// 把阿拉斯加移到美国主大陆左下方
			Alaska: {
				// 左上角经度
				left: -131,
				// 左上角纬度
				top: 25,
				// 经度横跨的范围
				width: 15,
			},
			// 夏威夷
			Hawaii: {
				left: -110,
				top: 28,
				width: 5,
			},
			// 波多黎各
			'Puerto Rico': {
				left: -76,
				top: 26,
				width: 2,
			},
		});
	},
	mounted() {
		this.$nextTick(() => {
			this.init(this.options);
		});
		window.addEventListener('resize', () => {
			if (!this.myChart) return;
			this.myChart.resize();
		});
	},
	deactivated() {
		window.removeEventListener('resize', this.resize);
		this.myChart && this.myChart.clear();
	},
	methods: {
		init(options) {
			if (!options) {
				this.$emit('on-error', '参数未传递');
				this.isLoading = false;
				return;
			}
			// 基于准备好的dom，初始化echarts实例
			this.initMap();
			this.$emit('on-loaded');
			this.isLoading = false;
		},
		initMap() {
			this.$nextTick(() => {
				const myChart = echarts.init(document.getElementById(this.chartId));
				myChart.setOption(
					{
						backgroundColor: '#000',
						geo: {
							map: 'china',
							aspectScale: 0.75, //长宽比
							zoom: 1.1,
							roam: false,
							itemStyle: {
								normal: {
									areaColor: {
										type: 'radial',
										x: 0.5,
										y: 0.5,
										r: 0.8,
										colorStops: [
											{
												offset: 0,
												color: '#09132c', // 0% 处的颜色
											},
											{
												offset: 1,
												color: '#274d68', // 100% 处的颜色
											},
										],
										globalCoord: true, // 缺省为 false
									},
									shadowColor: 'rgb(58,115,192)',
									shadowOffsetX: 3,
									shadowOffsetY: 3,
								},
								emphasis: {
									areaColor: '#2AB8FF',
									borderWidth: 0,
									color: 'green',
									label: {
										show: false,
									},
								},
							},
							regions: [
								{
									name: '南海诸岛',
									itemStyle: {
										areaColor: 'rgba(0, 10, 52, 1)',
										borderColor: 'rgba(0, 10, 52, 1)',
										normal: {
											opacity: 0,
											label: {
												show: false,
												color: '#009cc9',
											},
										},
									},
								},
							],
						},
						series: [
							{
								map: 'china', //使用
								type: 'map',
								roam: false,
								zoom: 1.1,
								label: {
									normal: {
										show: true,
										textStyle: {
											color: 'rgb(183,185,14)',
										},
									},
									emphasis: {
										textStyle: {
											color: 'rgb(183,185,14)',
										},
									},
								},
								itemStyle: {
									normal: {
										borderWidth: 1,
									},
									emphasis: {
										areaColor: '#333',
										borderColor: '#000',
										borderWidth: 2,
									},
								},
								select: {
									itemStyle: {
										areaColor: '#000',
										borderColor: '#f00',
										borderWidth: 2,
									},
								},
							},
							{
								type: 'effectScatter',
								coordinateSystem: 'geo',
								showEffectOn: 'render',
								zlevel: 1,
								rippleEffect: {
									period: 15,
									scale: 4,
									brushType: 'fill',
								},
								hoverAnimation: true,
								label: {
									normal: {
										formatter: '{b}',
										position: 'right',
										offset: [15, 0],
										color: '#1DE9B6',
										show: true,
									},
								},
								itemStyle: {
									normal: {
										color: '#1DE9B6',
										shadowBlur: 10,
										shadowColor: '#333',
									},
								},
								symbolSize: 12,
								data: points,
							}, //地图线的动画效果
							{
								type: 'lines',
								zlevel: 2,
								effect: {
									show: true,
									period: 3, //箭头指向速度，值越小速度越快
									trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
									symbol: 'arrow', //箭头图标
									symbolSize: 5, //图标大小
								},
								lineStyle: {
									normal: {
										color: '#1DE9B6',
										width: 1, //线条宽度
										opacity: 0.2, //尾迹线条透明度
										curveness: 0.2, //尾迹线条曲直度
									},
								},
								data: [
									{
										coords: [
											[120.0744, 29.30558],
											[113.23333, 23.16667],
										],
										lineStyle: { color: '#4a02e5' },
									},
									{
										coords: [
											[113.23333, 23.16667],
											[120.0744, 29.30558],
										],
										lineStyle: { color: '#1fb6d2' },
									},
								],
							},
						],
					},
					true,
				);
			});
		},
		resize: debounce(function () {
			window.removeEventListener('resize', this.resize);
			if (!this.myChart) return;
			this.myChart.resize();
		}, 50),
	},
	watch: {
		options: {
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
