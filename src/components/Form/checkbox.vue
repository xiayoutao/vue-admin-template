<template>
	<el-checkbox
		ref="checkbox"
		v-bind="$attrs"
		v-model="inputValue"
		:label="label"
		v-on="$listeners"
	>
		{{ text }}
	</el-checkbox>
</template>

<script>
import FormMixin from './mixin';

export default {
	mixins: [FormMixin],
	props: {
		label: String,
		text: String,
	},
	data() {
		return {};
	},
};
</script>