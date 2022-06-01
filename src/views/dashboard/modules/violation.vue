<template>
	<card-count
		title="违章统计"
		:show-filter="true"
		:start="startDate"
		:end="endDate"
		@change="getData"
	>
		<chart-show id="violation" :option="option"></chart-show>
	</card-count>
</template>

<script>
import ChartShow from '@cps/Chart/show.vue';
import CardCount from '../components/card-count.vue';
import { getBarOption } from '@/utils/echarts';
import { violation } from '@/apis/dashboard';

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
				const res = await violation({ startDate, endDate });
				let count = [0, 0, 0];
				let points = [0, 0, 0];
				let amount = [0, 0, 0];
				res.data.forEach((item) => {
					let index = 0;
					if (item.des === '"违章合计') {
						index = 0; // 合计
					} else if (item.des === '现场') {
						index = 1; // 现场
					} else if (item.des === '电子') {
						index = 2; // 电子
					}
					count[index] = item.number;
					points[index] = item.fraction;
					amount[index] = item.fine;
				});
				this.option = getBarOption({
					color: ['#01B0FF', '#4ECB73', '#F2637B', '#FBD437'],
					legend: {
						data: ['次数', '扣分', '罚款'],
					},
					xAxis: {
						data: ['违章合计', '现场违章', '电子违章'],
					},
					series: [
						{
							type: 'bar',
							name: '次数',
							barGap: 0,
							barMaxWidth: 12,
							data: count,
						},
						{
							type: 'bar',
							name: '扣分',
							barMaxWidth: 12,
							data: points,
						},
						{
							type: 'bar',
							name: '罚款',
							barMaxWidth: 12,
							data: amount,
						},
					],
				});
			} catch (err) {}
		},
	},
};
</script>

<style></style>
