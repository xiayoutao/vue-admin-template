<template>
	<card-count title="车型使用统计">
		<chart-show id="model-use" :option="option"></chart-show>
	</card-count>
</template>

<script>
import ChartShow from '@cps/Chart/show.vue';
import CardCount from '../components/card-count.vue';
import { getBarOption } from '@/utils/echarts';
import { modelUse } from '@/apis/dashboard';

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
				const res = await modelUse();
				let total = [0, 0, 0, 0];
				let use = [0, 0, 0, 0];
				let free = [0, 0, 0, 0];
				let repair = [0, 0, 0, 0];
				res.data.forEach((item) => {
					let index = 0;
					if (item.type === 'truck') {
						index = 0; // 货车
					} else if (item.type === 'trailer') {
						index = 1; // 挂车
					} else if (item.type === 'tractor') {
						index = 2; // 牵引车
					} else if (item.type === 'business') {
						index = 3; // 商务车
					}
					total[index] = item.total;
					use[index] = item.use;
					free[index] = item.free;
					repair[index] = item.repair;
				});
				this.option = getBarOption({
					color: ['#01B0FF', '#4ECB73', '#F2637B', '#FBD437'],
					legend: {
						data: ['总数', '使用', '闲置', '维修/保养'],
					},
					xAxis: {
						data: ['货车', '挂车', '牵引车', '商务车'],
					},
					series: [
						{
							type: 'bar',
							name: '总数',
							barGap: 0,
							barMaxWidth: 12,
							data: total,
						},
						{
							type: 'bar',
							name: '使用',
							barMaxWidth: 12,
							data: use,
						},
						{
							type: 'bar',
							name: '闲置',
							barMaxWidth: 12,
							data: free,
						},
						{
							type: 'bar',
							name: '维修/保养',
							barMaxWidth: 12,
							data: repair,
						},
					],
				});
			} catch (err) {}
		},
	},
};
</script>

<style></style>
