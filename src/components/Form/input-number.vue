<template>
	<el-input-number
		v-bind="$attrs"
		v-model="inputValue"
		v-on="$listeners"
		style="width: 100%"
	></el-input-number>
</template>

<script>
import FormMixin from './mixin';

export default {
	mixins: [FormMixin],
};
</script>