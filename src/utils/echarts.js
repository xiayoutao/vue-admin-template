// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';

// 引入柱状图图表，图表后缀都为 Chart
import {
	BarChart,
	PieChart,
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
		grid: Object.assign(
			{
				top: '15%',
				left: '15%',
				right: '6%',
				bottom: '15%',
			},
			option.grid,
		),
		legend: Object.assign(
			{
				itemWidth: 12,
				itemHeight: 12,
				textStyle: {
					color: '#fff',
				},
			},
			option.legend,
		),
		tooltip: Object.assign(
			{
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
			},
			option.tooltip,
		),
		xAxis: Object.assign(
			{
				type: 'category',
				axisTick: { show: false },
				splitLine: {
					show: false,
				},
			},
			option.xAxis,
		),
		yAxis: Object.assign(
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
		legend: Object.assign(
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
			Object.assign(
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

export default echarts;
