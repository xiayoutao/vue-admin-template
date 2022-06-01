<template>
	<!-- 日历 -->
	<el-date-picker
		ref="datePicker"
		v-bind="$attrs"
		v-model="dateValue"
		v-on="$listeners"
		:type="dateType || 'date'"
		:value-format="valueFormat || format || 'yyyy-MM-dd'"
		:picker-options="pickerOptions"
		style="width: 100%"
	></el-date-picker>
</template>

<script>
import FormMixin from './mixin';

export default {
	mixins: [FormMixin],
	props: {
		value: [String, Number],
		dateType: String,
		valueFormat: String,
		format: String,
		pickerOptions: Object,
	},
	data() {
		return {
			dateValue: null,
		};
	},
	watch: {
		value: {
			handler(val) {
				this.dateValue = val;
			},
			immediate: true,
		},
		dateValue(val) {
			this.$emit('input', val);
		},
	},
};
</script>