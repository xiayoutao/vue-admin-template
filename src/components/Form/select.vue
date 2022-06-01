<template>
	<!-- 下拉框 -->
	<el-select
		ref="select"
		v-bind="$attrs"
		v-model="inputValue"
		:clearable="getPropsByDefault('clearable', true)"
		v-on="$listeners"
		style="width: 100%"
	>
		<el-option
			v-for="(option, index) in dataList"
			v-bind="option"
			:key="`${option.value}_${index}`"
		></el-option>
	</el-select>
</template>

<script>
import FormMixin from './mixin';

export default {
	mixins: [FormMixin],
};
</script>