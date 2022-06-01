<template>
	<card-count
		title="用车费用统计"
		:show-filter="true"
		:start="startDate"
		:end="endDate"
	>
		<chart-show id="car-use-cost" :option="option"></chart-show>
	</card-count>
</template>

<script>
import ChartShow from '@cps/Chart/show.vue';
import CardCount from '../components/card-count.vue';
import { getBarOption } from '@/utils/echarts';
import { carUseCost } from '@/apis/dashboard';

export default {
	props: {
		startDate: String,
		endDate: String,
	},
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
		this.getData(this.startDate, this.endDate);
	},
	methods: {
		async getData(startDate, endDate) {
			if (!startDate || !endDate) return;
			try {
				const res = await carUseCost();
				let seriesData = [0, 0, 0, 0, 0];
				Object.keys(res.data).forEach((key) => {
					let index = 0;
					if (key === 'outcarFee') {
						index = 0; // 外请车费
					} else if (key === 'oilFee') {
						index = 1; // 加油费
					} else if (key === 'bridgeFee') {
						index = 2; // 路桥费
					} else if (key === 'foodFee') {
						index = 3; // 餐饮费
					} else if (key === 'otherFee') {
						index = 4; // 其他费用
					}
					seriesData[index] = res.data[key];
				});
				this.option = getBarOption({
					color: ['#F2637B', '#01B0FF', '#4ECB73', '#FBD437', '#36CBCB'],
					xAxis: {
						data: ['外请车费', '加油费', '路桥费', '餐饮费', '其他费用'],
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
