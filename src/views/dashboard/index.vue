<template>
	<div class="page-dashboard">
		<div class="count-left">
			<template v-for="(item, index) in leftLayouts">
				<component
					:is="item.name"
					:key="index"
					:startDate="startDate"
					:endDate="endDate"
				></component>
			</template>
		</div>
		<div class="count-main">
			<div class="main-title">调控车次监控：{{ today | filterData }}</div>
			<div class="main-header">
				<main-card :list="trainNumberTodayData"></main-card>
				<main-card :list="trainNumberCountData"></main-card>
				<main-card :list="trainNumberMonthData"></main-card>
			</div>
			<div class="main-bottom">
				<div class="main-map">
					<chart-map id="map" :option="{}"></chart-map>
				</div>
				<main-transport
					:trouble="troubleCount"
					:lateStart="lateStartCount"
					:lateArrive="lateArriveCount"
					:stop="stopCount"
				></main-transport>
			</div>
		</div>
		<div class="count-right">
			<template v-for="(item, index) in rightLayouts">
				<component
					:is="item.name"
					:key="index"
					:startDate="startDate"
					:endDate="endDate"
				></component>
			</template>
		</div>
	</div>
</template>

<script>
import { formatDate } from '@/utils/date';
import ChartShow from '@cps/Chart/show.vue';
import ChartMap from '@cps/Chart/map.vue';
import MainCard from './components/main-card.vue';
import MainTransport from './components/main-transport.vue';
import { trainNumberCount } from '@/apis/dashboard';

const modulesFiles = require.context('./modules', true, /\.vue$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
	const value = modulesFiles(modulePath);
	modules[moduleName] = value.default;
	return modules;
}, {});

export default {
	name: 'dashboard',
	components: {
		...modules,
		ChartShow,
		ChartMap,
		MainCard,
		MainTransport,
	},
	filters: {
		filterData(date) {
			return formatDate(new Date(date), 'yyyy年MM月dd日');
		},
	},
	data() {
		return {
			today: '', // 今天
			startDate: '', // 开始时间
			endDate: '', // 结束时间
			// 布局信息
			layouts: [
				{ position: 'left', name: 'model-use' },
				{ position: 'left', name: 'train-number' },
				{ position: 'left', name: 'tire-use' },
				{ position: 'right', name: 'car-use-cost' },
				{ position: 'right', name: 'violation' },
				{ position: 'right', name: 'expire-alert' },
			],
			// 当天车次
			trainNumberTodayData: [
				{ label: '当日新增车次', value: 50 },
				{ label: '当日已派车次', value: 85 },
				{ label: '当日外请车次', value: 126 },
			],
			trainNumberCountData: [
				{ label: '已发车次', value: 50 },
				{ label: '在途车次', value: 65 },
				{ label: '到达车次', value: 12 },
			],
			// 当月车次
			trainNumberMonthData: [
				{ label: '当月总车次', value: 650 },
				{ label: '当月已派车次', value: 452 },
				{ label: '当月外请车次', value: 159 },
			],
			troubleCount: 0, // 运输事故
			lateStartCount: 0, // 晚发车次
			lateArriveCount: 0, // 晚到车次
			stopCount: 0, // 停留车次
		};
	},
	computed: {
		leftLayouts() {
			return this.layouts.filter((item) => item.position === 'left');
		},
		rightLayouts() {
			return this.layouts.filter((item) => item.position === 'right');
		},
	},
	created() {
		this.initDate();
	},
	methods: {
		async getTrainNumberCount() {
			try {
				const res = await trainNumberCount();
				this.trainNumberTodayData[0].value = res.data.todayAddCount;
				this.trainNumberTodayData[1].value = res.data.todayStartCount;
				this.trainNumberTodayData[2].value = res.data.todayOutCount;
				this.trainNumberCountData[0].value = res.data.startCount;
				this.trainNumberCountData[1].value = res.data.onWayCount;
				this.trainNumberCountData[2].value = res.data.arriveCount;
				this.trainNumberMonthData[0].value = res.data.monthTotal;
				this.trainNumberMonthData[1].value = res.data.monthCompleteCount;
				this.trainNumberMonthData[2].value = res.data.monthOutCount;
			} catch (err) {}
		},
		initDate() {
			const d = new Date();
			this.today = formatDate(d, 'yyyy-MM-dd');
			const day = d.getDay(); // 周几
			d.setDate(d.getDate() - day + 1); // 周一
			this.startDate = formatDate(d, 'yyyy-MM-dd');
			d.setDate(d.getDate() + 6); // 周日
			this.endDate = formatDate(d, 'yyyy-MM-dd');
		},
	},
};
</script>

<style lang="scss" scoped>
.page-dashboard {
	@include flex-row();
	position: relative;
	box-sizing: border-box;
	min-width: 1500px;
	padding: 0;
	overflow-x: auto;
	background-color: #122034;
	user-select: none;

	&:before {
		position: absolute;
		top: 0;
		left: 50%;
		width: 70%;
		min-width: 600px;
		max-width: 1100px;
		height: 74px;
		background: url('/img/dashboard/header.png') no-repeat center;
		background-size: 100% auto;
		transform: translateX(-50%);
		content: '';
	}

	.count-left,
	.count-right {
		box-sizing: border-box;
		width: 24%;
		min-width: 320px;
		max-width: 390px;
		padding-top: 40px;
	}
	.count-left {
		margin-left: 20px;
	}
	.count-right {
		margin-right: 20px;
	}

	.count-main {
		@include flex-column();
		flex: 1;
		box-sizing: border-box;
		padding: 80px 0 0;

		.main-title {
			margin-bottom: 18px;
			color: #16ffff;
			font-size: 28px;
			text-align: center;
		}

		.main-header {
			@include flex-row();
			padding: 0 20px;

			.main-card {
				flex: 1;
				height: 128px;
				border: 2px solid #0060a6;
				border-radius: 10px;
				background: rgba(6, 39, 78, 0.75);
			}
		}
		.main-bottom {
			@include flex-row();
			flex: 1;

			.main-map {
				flex: 1;
			}
			.main-transport {
				@include flex-column('', center);
				width: 190px;
				height: 100%;
			}
		}
	}
}
</style>
