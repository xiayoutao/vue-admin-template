<template>
	<div class="main-map">
		<chart-map ref="chartMap" id="map" :option="option"></chart-map>
		<div class="toolbar">
			<span class="item" @click="updateZoom(-0.2)"></span>
			<span class="item" @click="updateZoom(0.2)"></span>
		</div>
	</div>
</template>

<script>
import ChartMap from '@cps/Chart/map.vue';
import { getMapOption } from '@/utils/echarts';
import { mapJson } from '@/apis/common';
import { task } from '@/apis/dashboard';

export default {
	components: {
		ChartMap,
	},
	data() {
		return {
			zoom: 1.2,
			option: {},
			dataList: [],
			lines: [],
			points: [],
		};
	},
	created() {
		this.getMapJson();
	},
	methods: {
		updateZoom(num) {
			if (num > 0 && this.zoom + num >= 2.4) {
				this.zoom = 2.4;
			} else if (num < 0 && this.zoom + num <= 0.4) {
				this.zoom = 0.4;
			}
			this.zoom += num;
			this.getOption();
		},
		async getData() {
			try {
				const res = await task();
				console.log('res', res);
				this.dataList = res.data;
				let points = [];
				let lines = [];
				res.data.forEach((item) => {
					if (!points.includes(item.from)) {
						points.push(item.from);
					}
					if (!points.includes(item.to)) {
						points.push(item.to);
					}
					lines.push({
						coords: [item.from, item.to],
					});
				});
				this.points = points;
				this.lines = lines;
				this.getOption();
			} catch (err) {}
			await this.sleep(1500);
		},
		getOption() {
			this.option = getMapOption({
				backgroundColor: '#122034',
				geo: {
					roam: false,
					zoom: this.zoom,
				},
				series: [
					{
						type: 'map',
						map: 'china', //使用
						zoom: this.zoom,
					},
					{
						type: 'effectScatter',
						symbolSize: 5,
						itemStyle: {},
						data: this.points,
					}, //地图线的动画效果
					{
						type: 'lines',
						zlevel: 2,
						effect: {
							show: true,
							period: 2, // 箭头指向速度，值越小速度越快
							trailLength: 0.2, // 特效尾迹长度[0,1]值越大，尾迹越长重
							symbol: 'arrow', // 箭头图标
							symbolSize: 3, // 图标大小
						},
						data: this.lines,
					},
				],
			});
		},
		async getMapJson() {
			try {
				await this.sleep(2000);
				const res = await mapJson();
				this.$refs.chartMap.registerMap(res.data);
				this.getData();
			} catch (err) {}
		},
	},
};
</script>

<style lang="scss" scoped>
.main-map {
	position: relative;
	flex: 1;

	.toolbar {
		position: absolute;
		bottom: 30px;
		left: 30px;

		.item {
			display: block;
			width: 32px;
			height: 32px;
			border: 1px solid #2d8bc9;
			border-radius: 2px;
			background: rgba(#142948, 0.6);
			cursor: pointer;
		}
	}
}
</style>
