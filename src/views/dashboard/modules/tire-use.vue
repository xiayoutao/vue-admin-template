<template>
	<card-count title="轮胎使用统计">
		<chart-show id="tire-use" :option="option"></chart-show>
	</card-count>
</template>

<script>
import ChartShow from '@cps/Chart/show.vue';
import CardCount from '../components/card-count.vue';
import { getBarOption } from '@/utils/echarts';
import { tireUse } from '@/apis/dashboard';

export default {
	components: {
		ChartShow,
		CardCount,
	},
	data() {
		return {
			option: {},
		};
	},
	created() {
		this.getData();
	},
	methods: {
		async getData() {
			try {
				const res = await tireUse();
				let xAxisData = [];
				let seriesData = [];
				res.data.forEach((item) => {
					xAxisData.push(item.des);
					seriesData.push(item.strip);
				});
				this.option = getBarOption({
					color: ['#0184FF', '#0184FF', '#4ECB73', '#F2637B', '#36CBCB'],
					xAxis: {
						data: xAxisData,
					},
					yAxis: {
						type: 'value',
					},
					series: [
						{
							type: 'bar',
							barMaxWidth: 25,
							colorBy: 'data',
							data: seriesData,
						},
					],
				});
			} catch (err) {}
		},
	},
};
</script>

<style></style>
