<template>
	<!-- 输入框 -->
	<el-input
		ref="input"
		v-bind="$attrs"
		v-model="inputValue"
		:type="getPropsByDefault('inputType', 'text')"
		style="width: 100%"
		:clearable="getPropsByDefault('clearable', true)"
		@keyup.enter.native="handleEnter"
		v-on="$listeners"
	>
		<el-select
			slot="prepend"
			v-model="selectValue"
			value-key="value"
			filterable
			:style="{ minWidth: '80px', width: prependWidth }"
			v-if="$attrs.prepend === 'select'"
		>
			<el-option
				v-for="(option, index) in dataList"
				v-bind="option"
				:key="`${option.value}_${index}`"
			></el-option>
		</el-select>
		<span
			:class="inputValue"
			slot="append"
			v-if="$attrs.append === 'icon'"
		></span>
		<el-button
			:class="$attrs.appendIcon"
			slot="append"
			@click="appendClick"
			v-else-if="$attrs.append === 'button'"
		></el-button>
	</el-input>
</template>

<script>
import FormMixin from './mixin';

export default {
	mixins: [FormMixin],
	props: {
		prependValue: [String, Number],
		prependWidth: {
			type: String,
			default: '100px',
		},
		appendClick: {
			type: Function,
			default: () => {},
		},
	},
	data() {
		return {
			selectValue: null,
		};
	},
	watch: {
		prependValue: {
			handler(val) {
				this.selectValue = val;
			},
			immediate: true,
		},
		selectValue(val) {
			this.$emit('change', val);
			this.$emit('update:prependValue', val);
		},
	},
	methods: {
		handleEnter() {
			if (this.isFunction(this.$listeners.enter)) {
				this.$listeners.enter(this.inputValue);
			}
		},
	},
};
</script>

<style scoped lang="scss">
/deep/.el-input-group__prepend {
	.el-select {
		.el-input__inner {
			font-size: 12px;
			letter-spacing: -0.5px;
		}
	}
}
</style>
