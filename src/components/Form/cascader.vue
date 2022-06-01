<template>
	<el-cascader
		ref="cascader"
		v-bind="$attrs"
		v-model="inputValue"
		:options="dataList"
		:props="props"
		transfer
		filterable
		:clearable="getPropsByDefault('clearable', true)"
		v-on="{
			...$listeners,
			change: handleChange,
		}"
		style="width: 100%"
	></el-cascader>
</template>

<script>
import FormMixin from './mixin';

export default {
	mixins: [FormMixin],
	props: {
		value: [String, Number, Boolean, Array],
		props: {
			type: Object,
			default() {
				return { value: 'value', label: 'title' };
			},
		},
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
	methods: {
		handleChange(val) {
			let pathLabels = [];
			if (val.length > 0) {
				const checkedNodes = this.$refs.cascader.getCheckedNodes(); // 正常选中数据或清空组件数据
				const suggestions = this.$refs.cascader.suggestions; // 选择匹配到的内容
				if (checkedNodes.length > 0) {
					pathLabels = checkedNodes[0].pathLabels;
				} else if (suggestions.length > 0) {
					pathLabels = suggestions[0].pathLabels;
				}
			}
			if (this.isFunction(this.$listeners.change)) {
				this.$listeners.change([...val], [...pathLabels]);
			}
		},
	},
};
</script>