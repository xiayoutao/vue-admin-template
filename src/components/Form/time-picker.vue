<template>
	<el-time-picker
		ref="timePicker"
		v-bind="$attrs"
		v-model="inputValue"
		:value-format="valueFormat || format || 'yyyy-MM-dd'"
		:picker-options="pickerOptions"
		:placeholder="getPropsByDefault('placeholder', '选择时间')"
		v-on="$listeners"
	></el-time-picker>
</template>

<script>
import FormMixin from './mixin';

export default {
	mixins: [FormMixin],
	props: {
		value: [String, Number],
		valueFormat: String,
		format: String,
		pickerOptions: Object,
	},
};
</script>