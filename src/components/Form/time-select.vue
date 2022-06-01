<template>
	<el-time-select
		ref="timeSelect"
		v-model="inputValue"
		:value-format="valueFormat || format || 'HH:mm:ss'"
		:picker-options="pickerOptions"
		:placeholder="getPropsByDefault('placeholder', '选择时间')"
		v-on="$listeners"
	></el-time-select>
</template>

<script>
import FormMixin from './mixin';

export default {
	mixins: [FormMixin],
	props: {
		value: [String, Number],
		valueFormat: String,
		format: String,
		pickerOptions: {
			type: Object,
			default() {
				return {
					start: '09:00',
					end: '22:00',
					step: '00:15',
				};
			},
		},
	},
};
</script>