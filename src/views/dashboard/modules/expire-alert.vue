<template>
	<card-count title="到期预警统计">
		<chart-show id="expire-alert" :option="option"></chart-show>
	</card-count>
</template>

<script>
import ChartShow from '@cps/Chart/show.vue';
import CardCount from '../components/card-count.vue';
import { getBarOption } from '@/utils/echarts';
import { expireAlert } from '@/apis/dashboard';

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
				const res = await expireAlert();
				let insurance = [0, 0, 0];
				let driving = [0, 0, 0];
				let operating = [0, 0, 0];
				res.data.forEach((item) => {
					let index = 0;
					if (item.type === '7天') {
						index = 0;
					} else if (item.type === '15天') {
						index = 1;
					} else if (item.type === '30天') {
						index = 2;
					}
					insurance[index] = item.insurance;
					driving[index] = item.driving;
					operating[index] = item.operating;
				});
				this.option = getBarOption({
					color: ['#F2637B', '#FBD437', '#0184FF'],
					legend: {
						data: ['7天', '15天', '30天'],
					},
					xAxis: {
						data: ['保险到期', '行驶证到期', '营运证到期'],
					},
					series: [
						{
							type: 'bar',
							name: '7天',
							barGap: 0,
							barMaxWidth: 12,
							data: insurance,
						},
						{
							type: 'bar',
							name: '15天',
							barMaxWidth: 12,
							data: driving,
						},
						{
							type: 'bar',
							name: '30天',
							barMaxWidth: 12,
							data: operating,
						},
					],
				});
			} catch (err) {}
		},
	},
};
</script>

<style></style>
