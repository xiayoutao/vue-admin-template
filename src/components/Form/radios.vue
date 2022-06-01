<template>
	<el-radio-group
		ref="radios"
		v-bind="$attrs"
		v-model="inputValue"
		v-on="$listeners"
	>
		<template v-if="radioType === 'button'">
			<el-radio-button
				v-for="option in dataList"
				:key="option.value"
				v-bind="option"
				:label="option.value"
			>
				{{ option.label }}
			</el-radio-button>
		</template>
		<template v-else>
			<el-radio
				v-for="option in dataList"
				:key="option.value"
				v-bind="option"
				:label="option.value"
			>
				{{ option.label }}
			</el-radio>
		</template>
	</el-radio-group>
</template>

<script>
import FormMixin from './mixin';

export default {
	mixins: [FormMixin],
	props: {
		radioType: String,
	},
	data() {
		return {};
	},
};
</script>