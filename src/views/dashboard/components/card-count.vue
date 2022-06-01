<template>
	<div class="count-card">
		<span class="angle top-left"></span>
		<span class="angle top-right"></span>
		<span class="angle bottom-left"></span>
		<span class="angle bottom-right"></span>
		<div class="header">
			<div class="title">{{ title }}</div>
			<div class="filter" v-if="showFilter">
				<el-date-picker
					class="date-count"
					v-model="startDate"
					value-format="yyyy-MM-dd"
					:picker-options="getPickerOptions(1)"
				></el-date-picker>
				<span>-</span>
				<el-date-picker
					class="date-count"
					v-model="endDate"
					value-format="yyyy-MM-dd"
					:picker-options="getPickerOptions(2)"
				></el-date-picker>
			</div>
		</div>
		<div class="body">
			<slot></slot>
		</div>
	</div>
</template>

<script>
import { isObject } from 'lodash';
import { modifyTime } from '@/utils/date';

export default {
	props: {
		title: String, // 标题
		start: String, // 开始日期
		end: String, // 结束日期
		showFilter: Boolean, // 是否显示日期过滤
	},
	data() {
		return {
			startDate: null,
			endDate: null,
		};
	},
	methods: {
		// 获取日期控件picker-options参数
		getPickerOptions(idx, data = {}) {
			const _this = this;
			const pickerOptions = isObject(data.pickerOptions)
				? data.pickerOptions
				: {};
			const val1 = _this.startDate;
			const val2 = _this.endDate;
			const hasVal1 = _this.hasValue(val1);
			const hasVal2 = _this.hasValue(val2);
			return {
				...pickerOptions,
				disabledDate(time) {
					time = modifyTime(time, 0, 0, 0);
					if (idx === 1) {
						return (
							hasVal2 &&
							time.getTime() > modifyTime(new Date(val2), 0, 0, 0).getTime()
						);
					} else if (idx === 2) {
						return (
							hasVal1 &&
							time.getTime() < modifyTime(new Date(val1), 0, 0, 0).getTime()
						);
					}
				},
			};
		},
		hasValue(val) {
			return this.isDeFined(val) && val !== '';
		},
	},
	watch: {
		start: {
			handler(val) {
				this.startDate = val;
			},
			immediate: true,
		},
		end: {
			handler(val) {
				this.endDate = val;
			},
			immediate: true,
		},
		startDate(val) {
			this.$emit('change', val, this.endDate);
		},
		endDate(val) {
			this.$emit('change', this.startDate, val);
		},
	},
};
</script>

<style lang="scss" scoped>
@import '../styles/card.scss';
</style>
