<template>
	<el-form
		class="form-filters"
		ref="form"
		:model="dataForm"
		inline
		size="small"
		@keydown.native.enter="handleSubmit()"
	>
		<el-form-item
			v-for="(item, index) in dataList"
			:key="index"
			:label="item.type === 'daterange' && item.dateSelect ? '  ' : item.label"
		>
			<!-- 输入框 -->
			<form-input
				v-bind="item"
				v-model="dataForm[item.key]"
				:prepend-value.sync="dataForm[item.selectKey]"
				:prepend-width="item.prependWidth"
				:options="item.options"
				v-on="item.events"
				v-if="item.type === 'input'"
			></form-input>
			<!-- 计数器 -->
			<form-input-number
				v-bind="item"
				v-model="dataForm[item.key]"
				v-on="item.events"
				v-else-if="item.type === 'inputNumber'"
			></form-input-number>
			<!-- 下拉框 -->
			<form-select
				v-bind="item"
				v-model="dataForm[item.key]"
				v-on="item.events"
				v-else-if="item.type === 'select'"
			></form-select>
			<form-select-tree
				v-bind="item"
				v-model="dataForm[item.key]"
				:list="item.options"
				:tree-props="item.treeProps"
				v-else-if="item.type === 'selectTree'"
			></form-select-tree>
			<!-- 日历 -->
			<form-date-picker
				v-bind="item"
				v-model="dataForm[item.key]"
				v-on="item.events"
				v-else-if="item.type === 'date'"
			></form-date-picker>
			<!-- 级联选择器 -->
			<form-cascader
				v-bind="item"
				v-model="dataForm[item.key]"
				:options="item.options"
				v-on="item.events"
				v-else-if="item.type === 'cascader'"
			></form-cascader>
			<!-- 日期范围 -->
			<template v-else-if="item.type === 'daterange'">
				<form-select
					v-model="dataForm[item.selectKey]"
					:options="item.options"
					:clearable="false"
					style="width: 100px; margin-right: 5px"
					v-if="item.prepend === 'select'"
				></form-select>
				<form-date-picker
					v-bind="item"
					v-model="dataForm[item.key1]"
					:key="item.key1"
					:type="item.dateType"
					:picker-options="getPickerOptions(item, 1)"
					placeholder="选择日期"
					style="width: 100px"
					v-on="{
						...item.events,
						change: ($event) =>
							isFunction(item.events.change) && item.events.change($event, 1),
						focus: ($event) =>
							isFunction(item.events.focus) && item.events.focus($event, 1),
						blur: ($event) =>
							isFunction(item.events.blur) && item.events.blur($event, 1),
					}"
				></form-date-picker>
				<span style="padding: 0 3px">-</span>
				<form-date-picker
					v-bind="item"
					v-model="dataForm[item.key2]"
					:key="item.key2"
					:type="item.dateType"
					:picker-options="getPickerOptions(item, 2)"
					placeholder="选择日期"
					v-on="{
						...item.events,
						change: ($event) =>
							isFunction(item.events.change) && item.events.change($event, 1),
						focus: ($event) =>
							isFunction(item.events.focus) && item.events.focus($event, 1),
						blur: ($event) =>
							isFunction(item.events.blur) && item.events.blur($event, 1),
					}"
				></form-date-picker>
			</template>
			<render
				:data="item.props"
				:render="item.render"
				v-else-if="item.type === 'render'"
			></render>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" icon="el-icon-search" @click="handleSubmit()">
				查询
			</el-button>
			<el-button icon="el-icon-refresh-right" @click="handleReset()">
				重置
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import { isObject, cloneDeep } from 'lodash';
import { formatDate } from '@/utils/date';
import { isHump } from '@/utils/validate';
import Render from '@cps/Render';
import FormInput from '@cps/Form/input.vue';
import FormInputNumber from '@cps/Form/input-number.vue';
import FormSelect from '@cps/Form/select.vue';
import FormSelectTree from '@cps/Form/select-tree.vue';
import FormDatePicker from '@cps/Form/date-picker.vue';
import FormCascader from '@cps/Form/cascader.vue';

export default {
	name: 'Filters',
	components: {
		Render,
		FormInput,
		FormInputNumber,
		FormSelect,
		FormSelectTree,
		FormDatePicker,
		FormCascader,
	},
	props: {
		value: {
			type: Object,
			default() {
				return {};
			},
		},
		config: Array,
		handle: Function,
		searchOnReset: {
			// 点击重置是否搜索
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			pickerOptions: {},
			defaultValues: {},
			dataForm: {},
			dataList: [],
			timeDiff: 0,
			duration: 500,
		};
	},
	watch: {
		config: {
			handler(val) {
				const dataList = [];
				const defaultValues = {};
				val.forEach((item, index) => {
					const data = this.handleFilterData(item, index);
					dataList.push(data);

					if (data.type !== 'daterange') {
						defaultValues[data.key] = data.defaultValue || '';
					}
					if (
						(data.type === 'input' || item.type === 'daterange') &&
						item.prepend === 'select'
					) {
						defaultValues[data.selectKey] = data.selectValue || '';
						defaultValues[data.key] = data.defaultValue || '';
					}
				});
				this.dataList = cloneDeep(dataList);
				this.defaultValues = { ...defaultValues };
				this.dataForm = { ...defaultValues };
			},
			deep: true,
			immediate: true,
		},
	},
	methods: {
		handleSubmit() {
			const now = Date.now();
			if (now - this.timeDiff < this.duration) {
				this.$message.warning('操作太频繁，请稍后再试');
				return;
			}
			this.timeDiff = now;
			this.search();
		},
		handleReset() {
			if (this.searchOnReset) {
				const now = Date.now();
				if (now - this.timeDiff < this.duration) {
					this.$message.warning('操作太频繁，请稍后再试');
					return;
				}
				this.timeDiff = now;
				this.dataForm = { ...this.defaultValues }; // 重置
				const data = this.getParams();
				this.$emit('change', { ...data });
			}
		},
		search() {
			let data = this.getParams();
			if (this.isFunction(this.handle)) {
				// 如果有传搜索条件的处理方法，则使用该方法处理参数
				data = this.handle(data);
			}
			this.$emit('change', { ...data });
		},
		// 根据dataForm值，返回相应的过滤条件
		getParams() {
			const filterData = {};
			this.dataList.forEach((item) => {
				const val = this.dataForm[item.key];
				const hasVal = this.hasValue(val); // 是否有值，undefined、null、空字符除外都算有值
				if (item.type === 'input' && item.prepend === 'select') {
					// 输入框包含下拉框
					const selectKey = this.dataForm[item.selectKey];
					if (hasVal) {
						filterData[selectKey] = this.dataForm[item.key];
					}
				} else if (item.type === 'date') {
					// 日期
					if (hasVal) {
						filterData[item.key] = val ? formatDate(val, item.format) : '';
					}
				} else if (item.type === 'daterange') {
					// 日期范围
					const val1 = this.dataForm[item.key1];
					const val2 = this.dataForm[item.key2];
					if (this.hasValue(val1) && this.hasValue(val2)) {
						if (item.prepend === 'select') {
							const selectKey = this.dataForm[item.selectKey];
							filterData[selectKey] = [
								this.dataForm[item.key1],
								this.dataForm[item.key2],
							].join(',');
						} else {
							filterData[item.key1] = formatDate(val1, item.format);
							filterData[item.key2] = formatDate(val2, item.format);
						}
					} else if (this.hasValue(val1) || this.hasValue(val2)) {
						this.$message.warning('请选择时间范围');
					}
				} else {
					if (hasVal) {
						filterData[item.key] = this.dataForm[item.key];
					}
				}
			});
			console.log('过滤条件', filterData);
			return filterData;
		},
		// 获取日期控件picker-options参数
		getPickerOptions(data, idx) {
			const _this = this;
			const pickerOptions = isObject(data.pickerOptions)
				? data.pickerOptions
				: {};
			if (data.type === 'daterange') {
				const val1 = _this.dataForm[data.key1];
				const val2 = _this.dataForm[data.key2];
				const hasVal1 = this.hasValue(val1);
				const hasVal2 = this.hasValue(val2);
				return {
					...pickerOptions,
					disabledDate(time) {
						if (idx === 1) {
							return hasVal2 && time.getTime() > new Date(val2).getTime();
						} else if (idx === 2) {
							return hasVal1 && time.getTime() < new Date(val1).getTime();
						}
					},
				};
			}
			return {
				...pickerOptions,
			};
		},
		// 格式化过滤配置
		handleFilterData(data, index) {
			const inputHasSelect =
				(data.type === 'input' || data.type === 'daterange') &&
				data.prepend === 'select';
			let events = {
				...(data.events || {}),
			};
			Object.keys(data).forEach((key) => {
				if (isHump(key)) {
					events[this.getEventName(key)] = this.isFunction(data[key])
						? data[key]
						: () => {};
				}
			});
			return {
				...data,
				key: inputHasSelect
					? `key_${data.type}_${index}`
					: `${data.key || 'key'}`,
				selectKey: inputHasSelect
					? `select_${data.type}_${index}`
					: `${data.key || 'select'}_${index}`,
				label: inputHasSelect ? '' : data.label,
				key1:
					data.type === 'daterange'
						? data.key1
							? data.key1
							: 'startDate'
						: '',
				key2:
					data.type === 'daterange' ? (data.key2 ? data.key2 : 'endDate') : '',
				options: (data.options || []).map((item) => {
					return {
						...item,
						label: item.label,
						value: item.prop || item.value || item.label, // 如果没有配置prop，则取value值
					};
				}),
				format:
					['date', 'daterange'].includes(data.type) && data.format
						? data.format
						: 'yyyy-MM-dd',
				dateType: ['date', 'datetime', 'time', 'timerange'].includes(
					data.dateType,
				)
					? data.dateType
					: 'date',
				clearable: this.getValueByDefault(data.clearable, true),
				style: {
					...(data.style || {}),
					width: data.type === 'daterange' ? '' : data.width || '130px',
				},
				disabled: Boolean(data.disabled),
				events,
			};
		},
		getValueByDefault(val, defaultValue) {
			return this.isUndefined(val) ? defaultValue : val;
		},
		hasValue(val) {
			return this.isDeFined(val) && val !== '';
		},
	},
};
</script>

<style lang="scss" scoped>
.form-filters {
	/deep/ .el-form-item {
		margin-right: 5px;
		margin-bottom: 5px;

		.el-form-item__label {
			padding-right: 3px;
		}
		.el-form-item__content {
			line-height: 28px;

			.el-input-group {
				vertical-align: baseline;
			}

			.el-input__prefix {
				left: 0;
			}
			.el-input__suffix {
				right: 0;
			}
		}

		.el-select .el-input,
		.el-date-editor.el-input {
			font-size: 12px;
		}
	}
}
</style>
