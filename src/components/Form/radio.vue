<template>
	<el-radio
		ref="radio"
		v-bind="$attrs"
		v-model="inputValue"
		:label="label"
		v-on="$listeners"
	>
		{{ text }}
	</el-radio>
</template>

<script>
import FormMixin from './mixin';

export default {
	mixins: [FormMixin],
	props: {
		label: String,
		text: String,
	},
};
</script>