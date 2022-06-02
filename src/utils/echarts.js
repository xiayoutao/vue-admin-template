// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import {
	BarChart,
	PieChart,
	LinesChart,
	MapChart,
	EffectScatterChart,
} from 'echarts/charts';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
	TitleComponent,
	LegendComponent,
	TooltipComponent,
	GridComponent,
	// DatasetComponent,
	// TransformComponent,
} from 'echarts/components';

import { merge } from 'lodash';

// 标签自动布局，全局过渡动画等特性
// import { LabelLayout, UniversalTransition } from 'echarts/features';

// 注册必须的组件
echarts.use([
	TitleComponent,
	LegendComponent,
	TooltipComponent,
	GridComponent,
	// DatasetComponent,
	// TransformComponent,
	BarChart,
	PieChart,
	LinesChart,
	MapChart,
	EffectScatterChart,
	// LabelLayout,
	// UniversalTransition,
	CanvasRenderer,
]);

// 获取柱状图配置
export function getBarOption(option) {
	return {
		...option,
		textStyle: {
			color: '#fff',
		},
		grid: merge(
			{
				top: '15%',
				left: '15%',
				right: '6%',
				bottom: '15%',
			},
			option.grid,
		),
		legend: merge(
			{
				itemWidth: 12,
				itemHeight: 12,
				textStyle: {
					color: '#fff',
				},
			},
			option.legend,
		),
		tooltip: merge(
			{
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
			},
			option.tooltip,
		),
		xAxis: merge(
			{
				type: 'category',
				axisTick: { show: false },
				splitLine: {
					show: false,
				},
			},
			option.xAxis,
		),
		yAxis: merge(
			{
				type: 'value',
				splitLine: {
					lineStyle: {
						type: 'dashed',
						color: '#7FD6FF',
					},
					show: true,
				},
			},
			option.yAxis,
		),
		series: option.series,
	};
}

export function getPieOption(option) {
	return {
		...option,
		textStyle: {
			color: '#fff',
		},
		tooltip: {
			trigger: 'item',
		},
		legend: merge(
			{
				itemWidth: 12,
				itemHeight: 12,
				textStyle: {
					color: '#fff',
				},
			},
			option.legend,
		),
		series: [
			merge(
				{
					type: 'pie',
					radius: ['60%', '80%'],
					avoidLabelOverlap: false,
					label: {
						show: true,
						position: 'center',
					},
					labelLine: {
						show: false,
					},
				},
				option.series,
			),
		],
	};
}

export function getMapOption(option) {
	let _map = {};
	let _effectScatter = {};
	let _lines = {};
	const { series = [] } = option;
	series.forEach((item) => {
		if (item.type === 'map') {
			_map = item;
		} else if (item.type === 'effectScatter') {
			_effectScatter = item;
		} else if (item.type === 'lines') {
			_lines = item;
		}
	});
	return {
		...option,
		geo: merge(
			{
				map: 'china',
				scaleLimit: {
					min: 0.4,
					max: 2.4,
				},
				itemStyle: {
					areaColor: '#142948',
					borderWidth: 1,
					borderColor: '#0B638B',
					shadowColor: 'rgb(58,115,192)',
					shadowOffsetX: 3,
					shadowOffsetY: 3,
				},
				regions: [
					{
						name: '南海诸岛',
						itemStyle: {
							opacity: 0,
							areaColor: 'rgba(0, 10, 52, 1)',
							borderColor: 'rgba(0, 10, 52, 1)',
							label: {
								show: false,
								color: '#009cc9',
							},
						},
					},
				],
			},
			option.geo,
		),
		series: [
			merge(
				{
					type: 'map',
					map: 'china', //使用
					scaleLimit: {
						min: 0.4,
						max: 2.4,
					},
					label: {
						show: true,
						fontSize: 12,
						color: '#2CDEDD',
					},
					itemStyle: {
						borderWidth: 1,
						borderColor: '#0060A6',
						areaColor: '#183B6D',
					},
					emphasis: {
						label: {
							color: '#2CDEDD',
						},
						itemStyle: {
							borderWidth: 2,
							borderColor: '#0060A6',
							areaColor: '#183B6D',
						},
					},
					select: {
						label: {
							color: '#2CDEDD',
						},
						itemStyle: {
							borderWidth: 2,
							borderColor: '#0060A6',
							areaColor: '#183B6D',
						},
					},
				},
				_map,
			),
			merge(
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
					label: {
						show: true,
						position: 'right',
						offset: [15, 0],
						color: '#1DE9B6',
						formatter: '{b}',
						// formatter(params) {
						// 	console.log('params.name', params.name);
						// },
					},
					itemStyle: {
						color: '#FBD437',
					},
					symbolSize: 5,
					data: [],
				},
				_effectScatter,
			), //地图线的动画效果
			merge(
				{
					type: 'lines',
					zlevel: 2,
					effect: {
						show: true,
						period: 3, // 箭头指向速度，值越小速度越快
						trailLength: 0.4, // 特效尾迹长度[0,1]值越大，尾迹越长重
						symbol: 'arrow', // 箭头图标
						symbolSize: 5, // 图标大小
					},
					lineStyle: {
						color: '#FBD437',
						width: 1, //线条宽度
						opacity: 0.2, //尾迹线条透明度
						curveness: 0.2, //尾迹线条曲直度
					},
					data: [],
				},
				_lines,
			),
		],
	};
}

export default echarts;
