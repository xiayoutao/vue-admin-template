<template>
	<el-checkbox-group
		ref="checkboxs"
		v-model="inputValue"
		v-bind="item"
		v-on="$listeners"
	>
		<template v-if="checkboxType === 'button'">
			<el-checkbox-button
				v-for="option in dataList"
				:key="option.value"
				:label="option.value"
			>
				{{ option.label }}
			</el-checkbox-button>
		</template>
		<template v-else>
			<el-checkbox
				v-for="option in dataList"
				:key="option.value"
				:label="option.value"
			>
				{{ option.label }}
			</el-checkbox>
		</template>
	</el-checkbox-group>
</template>

<script>
import FormMixin from './mixin';

export default {
	mixins: [FormMixin],
	props: {
		value: [String, Number, Boolean, Array],
		checkboxType: String,
	},
	data() {
		return {};
	},
	watch: {
		value: {
			handler(val) {
				this.inputValue = val;
			},
			deep: true,
			immediate: true,
		},
	},
};
</script>