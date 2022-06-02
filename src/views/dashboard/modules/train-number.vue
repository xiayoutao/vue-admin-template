<template>
	<card-count
		title="区域车次统计"
		:show-filter="true"
		:start="startDate"
		:end="endDate"
	>
		<chart-show id="train-number" :option="option"></chart-show>
	</card-count>
</template>

<script>
import ChartShow from '@cps/Chart/show.vue';
import CardCount from '../components/card-count.vue';
import { getPieOption } from '@/utils/echarts';
import { formatNumber } from '@/utils/format';
import { trainNumber } from '@/apis/dashboard';

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
				const res = await trainNumber();
				let totalData = 0; // 总数
				let seriesData = [];
				res.data.forEach((item) => {
					seriesData.push({
						value: item.strip,
						name: item.des,
					});
					totalData += Number(item.strip);
				});
				this.option = getPieOption({
					color: ['#0184FF', '#4ECB73', '#F2637B', '#FBD437'],
					legend: {
						top: '5%',
						left: 'right',
					},
					title: {
						show: true,
						x: 'center',
						y: '40%',
						text: '车次总数',
						subtext: formatNumber(totalData),
						textStyle: {
							fontSize: 16,
							color: '#B0E3FF',
						},
						subtextStyle: {
							fontWeight: 'bold',
							fontSize: 26,
							color: '#B0E3FF',
						},
					},
					series: {
						name: '区域车次统计',
						top: '10%',
						radius: ['50%', '70%'],
						label: {
							show: false,
						},
						data: seriesData,
					},
				});
			} catch (err) {}
		},
	},
};
</script>

<style></style>
